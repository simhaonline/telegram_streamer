// fluidPlayer method is global when CDN distribution is used.
var player = fluidPlayer(
    'example-player',
    {
        layoutControls: {
            fillToContainer: true, // Default true
            controlBar: {
                autoHide:           true,
                autoHideTimeout:    3,
                animated:           true
            },
            doubleclickFullscreen: true, // Default true
        }
    }
);

setTimeout(function() {
    document.getElementById('fluid_video_wrapper_example-player').focus()
}, 3000)