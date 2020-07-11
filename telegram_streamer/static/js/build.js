app.import([{'src':'/static/css/site.css','type':'style'}]);
function builder(){

    //build top of page
    let topper = app.mk("DIV");
    topper.setAttribute('id','pg_hd');

    let search = app.mk("input");
    search.setAttribute('id','srch_br');
    search.setAttribute('dir','ltr');

    let search_btn = app.mk("DIV");
    search_btn.setAttribute('id','srch_btn');

    let search_panel = app.mk("DIV");

    //build page content
    let content = app.mk("DIV");
    content.setAttribute('id','pg_cont');
        //build wrapper
        let wrapper = app.mk("DIV");
        wrapper.setAttribute('id','li_wrap');

    app.add(search,search_panel);
    app.add(search_btn,search_panel);
    app.add(search_panel,topper);
    app.add(wrapper,content);
    app.add(topper);
    app.add(content);

    getJSON("/data/data.json",function(d){
    let i;
    for(i=0;i<d.length;i++){
        console.log(d[i]);
        let name = app.mk('DIV');
        name.setAttribute('id','name');
        name.innerHTML = "<center>"+d[i].name+"</center>"
        let image = app.mk('DIV');
        image.setAttribute('class','img');
        image.setAttribute('style','background-image:url('+d[i].url+')');
        let movie = app.mk('DIV');
        movie.setAttribute('id','li_elem');
        movie.setAttribute('onclick','show('+i+')');
        app.add(image,movie);
        app.add(name,movie);
        app.add(movie,wrapper);
    }
    });
}
function show(id){
    let modal = app.mk('DIV');
    modal.setAttribute('class','modal');
    modal.setAttribute('id','modal');

    let hidder = app.mk('DIV');
    hidder.setAttribute('class','hidder');
    hidder.setAttribute('id','hidder');
    hidder.setAttribute('onclick','close_modal();');

    let details = app.mk('DIV');
    details.setAttribute('class','details');

    let trailer = app.mk('iframe');
    trailer.setAttribute('class','trailer_cont');
    trailer.setAttribute('src',json[id].trailer);
    trailer.setAttribute('frameborder','0');
    trailer.setAttribute('allowfullscreen','');

    let descrip = app.mk('DIV');
    descrip.setAttribute('class','description');
    descrip.innerHTML = "<center>"+json[id].descrip+"</center>";

    let video = app.mk('video');
    video.setAttribute('id','vid_play');
    video.setAttribute('controls','1');

    video_src = "/" + json[id].file_id + "/" + json[id].file_name
    video.setAttribute('src',video_src);

    app.add(modal);
    app.add(trailer,details);
    app.add(descrip,details);
    app.add(details,modal);
    app.add(video,modal);
    app.add(hidder);
}
function close_modal(){
    app.rm(app.find.id('modal'));
    app.rm(app.find.id('hidder'));
}
function lookfor(query){
        let i;
        for(i = 0 ; i < json.length ; i++){

        }
}