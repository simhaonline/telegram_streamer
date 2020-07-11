const _ = window.document;
var glob = this;
const device = (function(){
    if (screen.width < 900) {
        /* the viewport is 900 pixels wide or less */
        return "mobile";
    } else {
        /* the viewport is more than than 900 pixels wide */
        return "desktop";
    }
});
const app = {
    //Create Element
    mk:function(type,attrib){
        let el = _.createElement(type);
        if(isset(attrib)){
        let i;
        for(i=0;i>attrib.length;i++){
            el.setAttribute(""+attrib[i].type+"='"+attrib[i].val+"'");
        }
    }
        return el;
    },
    //Remove Element
    rm:function(el){
        el.parentNode.removeChild(el);
    },
    //Append Element To Parent
    add:function(el,daddy){
        if(daddy){
            daddy.appendChild(el);
        }
        else{
            window.document.body.appendChild(el);
        }
    },
    //Relocate Node As The First Child
    promote:function(el,parent){
        parent.prepend(el);
    },
    //Declare New Tag Type (Progress)
    reg:function(name){
        _.registerElement(name);
        return true;
    },
    //Search Element By ID, CLASS, TAG
    find: {
        id:function(id,parent){
            if(_.getElementById(id) == null || undefined){
                return false;
            }
            return _.getElementById(id);
        },
        class:function(data,parent){
            return _.getElementsByClassName(data);
        },
        tag:function(data,parent){
            if(isset(parent)){
                return parent.getElementsByTagName(data);
            }
            else{
                return _.getElementsByTagName(data);
            }
        }
    },
    //Make XMLhttpRequest
    req:function(type,url,data,headers){
        let ajax = new XMLHttpRequest();
        ajax.open(type,url,true);

        if(headers != undefined || headers != null){
            let i;
            for(i = 0;i < headers.length; i++){
                ajax.setRequestHeader(headers[i].header+','+headers[i].value+';');
            }
        }
            ajax.withCredentials;
            ajax.send(data);
            ajax.onreadystatechange = function(){
                if(ajax.readyState == 4 && ajax.status == 200){
                    return ajax.response;
                }
                else{

                }
            }
        },
    //Generate Random String
    random:function(length){
            let text = "";
            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          
            for (var i = 0; i < length; i++)
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          
            return text;
    },
    //Get Strings In Page
    scripts:(function(){
        let data = app.find.tag("script");
        let i;
        var fixed = new Array;
        for(i = 0;i<data.length;i++){
            if(isset(data[i].src) || isset(data[i].innerHTML) || data[i].text != ''){
                fixed.push(data[i]);
            }
        }
        return fixed;
    }),
    //import Scripts, Style .etc
    import:function(imports){
        let i = 0;
        for(i = 0;i<imports.length;i++){
            if(imports[i].type == 'script'){
            let script = _.createElement('script');
            script.src = imports[i].src;
            _.getElementsByTagName('head')[0].appendChild(script);
            }
            else if(imports[i].type == 'style'){
            let style = _.createElement('link');
            style.rel = 'stylesheet';
            style.href = imports[i].src;
            window.document.getElementsByTagName('head')[0].appendChild(style);
            }
            else{
            console.warn("Error");
            console.log(imports[i]);
            }
        }
    } 
}
//check if variable is set (isset, set, you got it? ;-) 
function isset(e){
    if(e != undefined || e != null){
        return true;
    }
    else
    {return false;}
}
//parse the parts of a link to Array
function linkpart(url,echo){
    let link = url.toString();
    link = link.split("//");
    if(echo != undefined || null){
        if(echo == "protocol"){
            return link[0]+"//";
        }
        else{
            if(link.length = 1){
                return false;
            }
            link = link[1].split("/");
            if(echo == "domain"){
                return link[0];
            }
            else if(echo == "data"){
                let data = new Array;
                let i;
                for(i = 1;i<link.length;i++){
                    data.push(link[i]);
                }
                return data;
            }
        }
        
    }
    else{
        let data = new Array;
        let parts = new Array;
            data.push(link[0]);
            link = link[1].split("/");
            parts.push(link[0]);
                for(i = 1;i<link.length;i++){
                    if(link[i] == ""){

                    }else{
                        parts.push(link[i]);
                    }
                }
            data.push(parts);
            return data;
    }
}
/*function $alert(data,type,custom){
    let alert = app.mk("div");
    alert.setAttribute("class","alrtbdi");
    let head = app.mk("div");
    head.setAttribute("class","head");
    let title = app.mk("Center");
    if(type == "err"){
        title.innerHTML = "ERROR!";
        head
    }
    else if(type == "success")
    let cont = app.mk("center");
    cont.innerHTML = data;

    //attach elements before Delivering
    app.add(cont,alert);
    app.add(cont,alert);
    app.add(title,head);
    app.add(head,alert);
}*/

//get JSON file content
function getJSON(filePath, callback, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (callback)
                    glob.json = JSON.parse(xhr.responseText);
                    callback(JSON.parse(xhr.responseText));
        } else {
            if (error)
                error(xhr);
            }
        }
    };
    xhr.open("GET", filePath, true);
    xhr.send();
}

var request = {
    "url":undefined,
    "type":undefined,
    "head":undefined
}