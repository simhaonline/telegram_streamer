import asyncio
import sys
import os
from aiohttp import web
from telethon import functions
import jinja2
import aiohttp_jinja2

from telegram import client, transfer
from web_player.web_routes import routes
from config import host, port, public_url, tg_bot_token
from log import log


project_root = os.path.dirname(os.path.abspath(__file__))


server = web.Application()

server.router.add_static('/static/',
    path=str(project_root + "/" + 'static'),
    name='static'
)

aiohttp_jinja2.setup(
    server, loader=jinja2.FileSystemLoader(os.path.join(os.getcwd(), "web_player/templates"))
)


server.add_routes(routes)
runner = web.AppRunner(server)

loop = asyncio.get_event_loop()


async def start() -> None:
    await client.start(bot_token=tg_bot_token)

    config = await client(functions.help.GetConfigRequest())
    for option in config.dc_options:
        if option.ip_address == client.session.server_address:
            if client.session.dc_id != option.id:
                log.warning(f"Fixed DC ID in session from {client.session.dc_id} to {option.id}")
            client.session.set_dc(option.id, option.ip_address, option.port)
            client.session.save()
            break
    transfer.post_init()

    await runner.setup()
    await web.TCPSite(runner, host, port).start()


async def stop() -> None:
    await runner.cleanup()
    await client.disconnect()


try:
    loop.run_until_complete(start())
except Exception:
    log.fatal("Failed to initialize", exc_info=True)
    sys.exit(2)

log.info("Initialization complete")
log.debug(f"Listening at http://{host}:{port}")
log.debug(f"Public URL prefix is {public_url}")

try:
    loop.run_forever()
except KeyboardInterrupt:
    loop.run_until_complete(stop())
except Exception:
    log.fatal("Fatal error in event loop", exc_info=True)
    sys.exit(3)
