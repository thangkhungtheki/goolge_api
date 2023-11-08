
$('document').ready(async () => {
    var data = await fetch('/g?idunique=94364&idfilm=4931')
    
    var playerInstance = jwplayer("videoPlayer");
    playerInstance.setup({
        playlist: [{
            sources: [{
                file: (await data.text()).toString(),
                // onXhrOpen: function(xhr, url) {
                //     if(url !== "png/output.m3u8"){
                //         //console.log(url)
                //         xhr._url = "127.0.0.1:3000/aaaa"
                //         return xhr

                //     }
                // }

            }]
        }],
        heigh: '360',
        width: '640',

    })
})