from typing import Dict, cast
from collections import defaultdict
import logging

from telethon.tl.custom import Message
from aiohttp import web
from config import public_url

import jinja2
import aiohttp_jinja2

from util import unpack_id, get_file_name, get_requester_ip
from config import request_limit
from telegram import client, transfer

log = logging.getLogger(__name__)
routes = web.RouteTableDef()
ongoing_requests: Dict[str, int] = defaultdict(lambda: 0)



@routes.get("/")
async def site(req):
    response = aiohttp_jinja2.render_template("site.html", req, context={})
    return response


@routes.get("/favicon.ico")
async def favicon(request):
    return web.FileResponse("static/favicon.ico")

@routes.head(r"/{id:\d+}/{name}")
async def handle_head_request(req: web.Request) -> web.Response:
    return await handle_request(req, head=True)


@routes.get(r"/{id:\d+}/{name}")
async def handle_get_request(req: web.Request) -> web.Response:
    return await handle_request(req, head=False)


def allow_request(ip: str) -> None:
    return ongoing_requests[ip] < request_limit


def increment_counter(ip: str) -> None:
    ongoing_requests[ip] += 1


def decrement_counter(ip: str) -> None:
    ongoing_requests[ip] -= 1


async def handle_request1(req: web.Request, head: bool = False) -> web.Response:
    file_name = req.match_info["name"]
    file_id = int(req.match_info["id"])
    video_url = str(public_url) + "/" + str(file_id) + "/" + file_name.replace(".html", "")
    
    video_name = file_name.split(".")[0].replace("נתי מדיה", "") # remove all the text after dot

    context = {
        'video_url': video_url,
        'video_name': video_name
    }
    response = aiohttp_jinja2.render_template("index.html", req,
                                        context=context)

    return response



async def handle_request(req: web.Request, head: bool = False) -> web.Response:
    if str(req.url).endswith("html"):
        return await handle_request1(req, head=False)

    file_name = req.match_info["name"]
    file_id = int(req.match_info["id"])
    print(f"file id: {file_id}, filename: {file_name}")
    video_url = str(public_url) + "/" + str(file_id) + "/" + file_name
    print("video_url:", video_url)

    video_name = file_name
    print(f"video_name: {video_name}")

   



    peer, msg_id = unpack_id(file_id)
    if not peer or not msg_id:
        return web.Response(status=404, text="404: Not Found, peer / msg_id not found")

    message = cast(Message, await client.get_messages(entity=peer, ids=msg_id))
    print(f"filename: {file_name}, getfilename: {get_file_name(message)}")
    if not message or not message.file or get_file_name(message) != file_name:
        return web.Response(status=404, text="404: Not Found, not message / message file")

    size = message.file.size
    offset = req.http_range.start or 0
    limit = req.http_range.stop or size

    if not head:
        ip = get_requester_ip(req)
        if not allow_request(ip):
            return web.Response(status=429)
        log.info(f"Serving file in {message.id} (chat {message.chat_id}) to {ip}")
        body = transfer.download(message.media, file_size=size, offset=offset, limit=limit)
    else:
        body = None

    

    return web.Response(status=206 if offset else 200,
                        body=body,
                        headers={
                            "Content-Type": message.file.mime_type,
                            "Content-Range": f"bytes {offset}-{size-1}/{size}",
                            "Content-Length": str(limit - offset),
                            "Content-Disposition": f'attachment; filename="{file_name}"',
                            "Accept-Ranges": "bytes",
                        })



