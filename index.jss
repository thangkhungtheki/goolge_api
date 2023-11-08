

var express = require('express')
var axios = require('axios')
var app = express()
var buffer = require('buffer')
var fs = require('fs')
const { google } = require('googleapis');
var https = require('https')
var http = require('http')
var axios = require('axios')
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
require('dotenv').config();
const { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } = process.env;

const request = require('request')
const { drive } = require('googleapis/build/src/apis/drive')
const { url } = require('inspector')

var Readable = require('stream').Readable;

function bufferToStream(buffer) {
    var stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    return stream;
}

const server = http.createServer((req, res) => {
    // Tạo yêu cầu HTTPS đến URL
    let _url = "https://storage.googleapiscdn.com/playlist/61e22be9017fc2091176dbf3/playlist.m3u8"
    let _headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'origin': 'https://animevietsub.fan',
        'referer': 'https://animevietsub.fan/'
    }
    let options = {
        method: 'get',
        headers: _headers
    }

    const httpsReq = https.request(_url, options, (httpsRes) => {
        console.log(httpsRes.statusCode)
        // Thiết lập header của phản hồi HTTP của máy chủ
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl; charset=utf-8');
        let data = Buffer.alloc(0);
        // Nhận dữ liệu từ phản hồi HTTPS và truyền trực tiếp vào phản hồi HTTP
        httpsRes.on('data', (chunk) => {
            //res.write(chunk);
           
        });

        // Khi phản hồi HTTPS kết thúc, đóng phản hồi HTTP
        httpsRes.on('end', () => {
            console.log('Dữ liệu dạng buffer:');
            //console.log(data.toString()); // Chuyển buffer thành chuỗi và in ra console
            
            res.end();
        });
    });

    // Xử lý lỗi khi gửi yêu cầu HTTPS
    httpsReq.on('error', (error) => {
        console.error(`Yêu cầu HTTPS gặp lỗi: ${error.message}`);
        res.statusCode = 500; // Đặt mã trạng thái lỗi nếu cần
        res.end();
    });

    // Kết thúc yêu cầu HTTPS
    httpsReq.end();
});

// server.listen(3000, () => {
//     console.log('Máy chủ đang lắng nghe tại cổng 3000');
// });

function  test_https() {
    let _url = "https://storage.googleapiscdn.com/playlist/61e22be9017fc2091176dbf3/playlist.m3u8"
    let _headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'origin': 'https://animevietsub.fan',
        'referer': 'https://animevietsub.fan/'
    }
    let options = {
        method: 'get',
        headers: _headers
    }

    const req = https.request(_url, options, (ress) => {
        
        console.log(ress.statusCode)
        // Nhận dữ liệu khi có sự kiện data
        ress.on('data', (chunk) => {
            // console.log(chunk);
           
        });

        // Khi hoàn thành yêu cầu, xử lý dữ liệu ở đây
        ress.on('end', () => {
            console.log('DATA END ở đây')
            
        });
    });

    // Xử lý lỗi khi gửi yêu cầu
    req.on('error', (error) => {
        console.error(`Yêu cầu gặp lỗi: ${error.message}`);
    });

    // Kết thúc yêu cầu
    
    //req.end();
}



const _tokens = {
    access_token: 'ya29.a0AfB_byDToJJZBWL0lezvXoJU5j2MaADnOidbOaN_gfCX560G_PSNscQIj0jEalhVdiBDGPsdrjGLuc8VvOWh3_ubYTv41CBKRxCRwBvtqxrJ4WyfN6swII0w9ICHdFrtCbaR5HLA_cX9MuYmiipK1r8Qc4CXPvyPwOnbaCgYKAegSARASFQGOcNnCpegDEMPZ8L7rFwn9-597uw0171',
    refresh_token: '1//0eOxTn3SD8cvwCgYIARAAGA4SNwF-L9IrEp6IoPkLCrKqRoYsYtLMvJ-B2phwcC5atiH8_s-i5VXH4wXVFo7GLLWuWho5ceYBMWo',
    scope: 'https://www.googleapis.com/auth/blogger https://www.googleapis.com/auth/blogger.readonly https://www.googleapis.com/auth/drive',
    token_type: 'Bearer',
    expiry_date: 1695012781772
}

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL
);


//This method returns a url where the users can see the oAuth consent screen
function getGoogleAuthURL() {

    // Add all the scopes required by your app in this array. 
    // For example, if the scope needed by your app is /auth/calendar, 
    // add it as https://www.googleapis.com/auth/calendar in the array
    const scope = [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/blogger',
        'https://www.googleapis.com/auth/blogger.readonly',

    ];
    console.log('hahaha')
    return oauth2Client.generateAuthUrl({
        //'offline' mode will return a refresh token which we can save in our database to access the user's data in the future
        access_type: 'offline',
        scope,
    });
}

async function getGoogleUser({ code }) {
    // This will return an object with the access_token and refresh_token
    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens)
    oauth2Client.setCredentials({
        refresh_token: tokens.refresh_token
    });

    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
        .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${tokens.id_token}`,
                },
            },
        )
        .then(res => {
            return { data: res.data, refresh_token: tokens.refresh_token };
        })
        .catch(error => {
            throw new Error(error.message);
        });
    console.log(googleUser)
    return googleUser;
}

// Global authentication
google.options({
    auth: oauth2Client
});

// Service level authentication - Example with Google Drive service
const _drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});


const blogger = google.blogger({
    version: 'v3',
    auth: oauth2Client
});



const params = {
    blogId: '8907104054359847181',
    postId: '3420325497532529859'
};

// get the blog details
// blogger.blogs.get(params, (err, res) => {
//     if (err) {
//         console.error(err);
//         throw err;
//     }
//     console.log(`The blog url is ${res.data.url}`);
// });





app.get('/auth/google', (req, res) => {
    res.redirect(getGoogleAuthURL());
});

app.get('/auth/google/callback', async (req, res) => {
    try {
        const googleUser = await getGoogleUser(req.query);

        //Get user id, email and name from the response
        const { id, email, name } = googleUser.data;

        //You can store this refresh token in your db for future access
        const refreshToken = googleUser.refresh_token;
        console.log(googleUser)
        console.log('refreshToken: ' + refreshToken)
        //Store the data in DB and redirect to some other page

    } catch (err) {
        //Error handling logic here
    }
})

app.get('/createtxt', async (req, res) => {
    const ress = await _drive.files.create({
        requestBody: {
            name: 'Testapiupload',
            mimeType: 'text/plain'
        },
        media: {
            mimeType: 'text/plain',
            body: 'Hello World'
        }
    });
    console.log(ress)
})

async function _uploadblogertest() {


    try {
        const media = fs.createReadStream('tsfile.png');

        const params = {
            blogId: '8907104054359847181',
            isDraft: false, // True nếu bạn muốn tải lên là bản nháp
            media: {
                mimeType: 'image/png',
                body: media,
            },
        };

        const response = await blogger.posts.insert(params);

        console.log('Hình ảnh đã được tải lên với URL:', response.data.url);
        console.log(response)
    } catch (error) {
        console.error('Lỗi khi tải lên hình ảnh:', error);
    }


}

app.get("/upblog", (req, res) => {
    _uploadblogertest()
    res.end()
})

async function _uploadtest() {

    const requestBody = {
        name: 'phototest.png',
        fields: 'id',
    };
    const media = {
        mimeType: 'image/png',
        body: fs.createReadStream('tsfile.png'),
    };
    try {
        const file = await _drive.files.create({
            requestBody,
            media: media,
        });
        console.log('File Id:', file.data.id);
        return file.data.id;
    } catch (err) {
        // TODO(developer) - Handle error
        throw err;
    }
}

app.get("/uploadtest", (req, res) => {
    _uploadtest()
    res.end()
})

app.get('/getfile', async (req, res) => {
    var d = google.drive({ version: "v3", auth: oauth2Client });
    var drive = await d.files.get({ fileId: "1Btly5209kKTaDP1Mk99svVjByvuSpG5N" });
    //var _file = await d.files.export({fileId: "1Btly5209kKTaDP1Mk99svVjByvuSpG5N", mimeType : 'image/png'} )
    var id = drive.data.id;
    console.log(drive.data);
    //console.log(_file)
    res.send(id)
})

async function _getlinkdowmload() {
    const getDownloadLink = async (fileId) => {


        try {
            const response = await _drive.files.get({
                fileId: fileId,
                fields: 'webViewLink,exportLinks',
            });

            const webViewLink = response.data.webViewLink;
            const exportLinks = response.data.exportLinks;
            const downloadLink = exportLinks['image/png']; // Thay thế 'application/pdf' nếu bạn muốn định dạng khác

            console.log('Liên kết xem trực tuyến:', webViewLink);
            console.log('Liên kết tải xuống:', downloadLink);
        } catch (error) {
            console.error('Lỗi khi lấy liên kết tải xuống:', error);
        }
    };
    getDownloadLink("1Btly5209kKTaDP1Mk99svVjByvuSpG5N")
}
app.get('/laylink', (req, res) => {
    _getlinkdowmload()
    res.end()
})

app.get("/filedownload", async (req, res) => {


    fileId = '1dlmssXa3Kkfv3IklCJTKjeV82a22Ep19';
    try {
        const file = await _drive.files.get({
            fileId: '1GzRLoPE2_HrJh8e1TTNpW7rvLGZOHizr',

        })
        // .then((data) => {
        //     console.log(data)
        //     res.send(data)
        // })
        console.log(file.status);
        console.log(file.data)
        //return file.status;
        res.send(file)
    }
    catch (err) {
        // TODO(developer) - Handle error
        throw err;
    }
})

app.get("/loadfile", (req, res) => {

    _drive.files.get(
        { fileId: "1GzRLoPE2_HrJh8e1TTNpW7rvLGZOHizr", alt: "media", },
        { responseType: "stream" },
        (err, { data }) => {
            if (err) {
                console.log(err);
                return;
            }
            let buf = [];
            data.on("data", (e) => {
                buf.push(e)
                //console.log(e)
                // const videoStream = fs.createReadStream(e)
                // var tr = bufferToStream(e)
                // const videoStream = fs.createReadStream(tr)
                // videoStream.pipe(res)
            });
            data.on("end", () => {
                const buffer = Buffer.concat(buf);
                // console.log(buffer);
                // req.send(buffer)
                console.log('END VIDEO')

            });

        }
    );

})

app.get('/savefile', (req, res) => {
    var dest = fs.createWriteStream("saveid_1GzRLoPE2_HrJh8e1TTNpW7rvLGZOHizr");  // Please set the filename of the saved file.
    _drive.files.get(
        { fileId: "1GzRLoPE2_HrJh8e1TTNpW7rvLGZOHizr", alt: "media" },
        { responseType: "stream" },
        (err, { data }) => {
            if (err) {
                console.log(err);
                return;
            }
            data
                .on("end", (e) => {
                    console.log("Done.")
                    console.log(data)
                })
                .on("error", (err) => {
                    console.log(err);
                    return process.exit();
                })
                .pipe(dest);
        }
    );
    res.send('hahahhahahahah')
})

app.get("/video", function (req, res) {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    const videoPath = "C:/Users/Admin/Desktop/tfile/filegoc.mp4";
    const videoSize = fs.statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));

    //const start = 0

    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.htm");
});

function _noifile() {
    var _rstream1 = fs.createReadStream('C:/Users/Admin/Desktop/tfile/video123.mp4')
    var _rstream2 = fs.createReadStream('C:/Users/Admin/Desktop/tfile/1.png')
    var img = new Buffer.from('C:/Users/Admin/Desktop/tfile/1.png');
    var dat = []
    // dat.push(img)
    // var buff = _rstream2.
    console.log(img)
    var _wstream = fs.createWriteStream('1234.png')
    // _wstream.on('data', function (chunk){

    // })
    _rstream2.on('data', (chunk) => {
        dat.push(chunk)
    })
    _rstream2.on('end', () => {
        console.log("File png đây !!!")
        console.log(dat)
    })
    _rstream1.on('data', function (chunk) {
        dat.push(chunk)
    })
    _rstream1.on('end', () => {
        // dat.push(img)
        console.log(dat)
    })
    var buff = new Buffer.concat(dat)
    _wstream.write(buff)
}

function noifile() {
    // Đọc nội dung của tệp PNG header
    const pngread = fs.readFileSync("C:/Users/Admin/Desktop/tfile/1pxred.png")
    const pngHeader = Buffer.from(pngread);
    const bien = 'fileTS/segment_001'
    console.log(pngHeader)
    // Đọc nội dung của tệp TS
    const tsFilePath = 'C:/Users/Admin/Desktop/tfile/phim1/' + bien + '.ts'; // Thay thế bằng đường dẫn đến tệp TS của bạn
    const tsData = fs.readFileSync(tsFilePath);

    // Chèn mã PNG header vào tiêu đề của tệp TS
    const newData = Buffer.concat([pngHeader, tsData]);

    // Ghi dữ liệu mới vào tệp TS
    const outputFilePath = 'segment_001.png'; // Tên tệp đầu ra
    fs.writeFileSync(outputFilePath, newData);
}

app.get('/get-m3u8', async (req, res) => {
    try {
      // Thay đổi URL bằng URL M3U8 bạn muốn lấy
    let _url = "https://storage.googleapiscdn.com/playlist/61e22be9017fc2091176dbf3/playlist.m3u8"
    let _headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'origin': 'https://animevietsub.fan',
        'referer': 'https://animevietsub.fan/'
    }
    let options = {
        method: 'get',
        headers: _headers
    }
  
      const response = await axios.get(_url,options);
  
      if (response.status === 200) {
        // Trả về nội dung M3U8
        
        res.send(response.data);
      } else {
        res.status(response.status).send('Không thể tải M3U8.');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      res.status(500).send('Đã xảy ra lỗi.');
    }
  });

async function getRedirectedUrlContent(url) {
    let _headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'origin': 'https://animevietsub.fan',
        'referer': 'https://animevietsub.fan/'
    }
    let options = {
        method: 'get',
        headers: _headers
    }
    try {
      const response = await axios.get(url, options, { maxRedirects: 0 });
      
      // Nếu không có lỗi và không có chuyển hướng, in nội dung URL ban đầu
      return response.data
  
    } catch (error) {
      if (error.response) {
        if (error.response.status === 302 || error.response.status === 301) {
          // Nếu có chuyển hướng, in URL mới và nội dung của URL mới
          const redirectedUrl = error.response.headers.location;
          console.log('URL đã chuyển hướng:', redirectedUrl);
  
          //const redirectedResponse = await axios.get(redirectedUrl);
          //console.log('Nội dung URL đã chuyển hướng:', redirectedResponse.data);
        } else {
          console.error('Lỗi không xác định:', error);
        }
      } else {
        console.error('Lỗi không xác định:', error);
      }
    }
  }
  
  // Gọi hàm với URL bạn muốn kiểm tra
  

app.get('/url_lh3',async (req, res) => {
    let data = await getRedirectedUrlContent('https://storage.googleapiscdn.com/chunks/61e745c2c92fe4d91e5c5728/720/DBcZHSxRWyBLVRlCVzIAAV1FAwwCCjMRHRILFTwICwAJBxpFBwwASG0yJycHPT0MKz0mGEMeBQ9aGhAFXyAKNDk2Lhs_MAU8KSAMJiYsAz4FCjolFB9fLD8eAxIpJh0cKSQeKTRXCD1dGisFMwUjQAY2Aw00UC49VThVWjdaIDssCAYCDQJDHxggJwMbWR8IUgoMAwomEVMJHzBVLwdcLitdCgAJHHpHLAU/video1572.html')
    res.send(data)
})

function checkpng() {
    const inputVideoPath = 'tsfile1.png'; // Thay đổi thành đường dẫn của tệp video đầu vào
    const outputVideoPath = 'output-video.mp4'; // Thay đổi thành đường dẫn của tệp video đầu ra
    const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]); // Định dạng chữ ký PNG

    // Đọc tệp video đầu vào
    const inputVideoBuffer = fs.readFileSync(inputVideoPath);

    // Tìm đoạn byte đầu tiên chứa chữ ký PNG
    const pngStartIndex = inputVideoBuffer.indexOf(pngSignature);

    if (pngStartIndex !== -1) {
        // Nếu tìm thấy định dạng PNG, loại bỏ nó bằng cách tạo một tệp video mới
        const outputVideoBuffer = Buffer.concat([
            inputVideoBuffer.slice(0, pngStartIndex), // Phần trước chữ ký PNG
            inputVideoBuffer.slice(pngStartIndex + pngSignature.length) // Phần sau chữ ký PNG
        ]);

        // Ghi tệp video mới
        fs.writeFileSync(outputVideoPath, outputVideoBuffer);

        console.log(`Đã loại bỏ phần chữ ký PNG và lưu tại ${outputVideoPath}`);
    } else {
        // Nếu không tìm thấy chữ ký PNG, không cần loại bỏ gì cả
        console.log('Không tìm thấy chữ ký PNG trong tệp video.');
    }
}

app.get('/checkpng',(req, res) => {
    checkpng()
})

app.get('/stream', (req, res) => {
    const videoPath = 'segment_000.mp4'; // Đường dẫn đến file .ts của bạn

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;
  
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4', // MIME type cho file .ts
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4', // MIME type cho file .ts
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }   
  }); 
  
//   const _http = require('http');
//   const fss = require('fs');
//   const HLS = require('hls-server');
  
//   const servers = _http.createServer((req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.end('HLS Server is running');
//   });
  
//   const hls = new HLS(servers, {
//     path: '/streams', // Đường dẫn truy cập HLS
//     dir: 'C:/Users/Admin/Desktop/tfile/phim1/fileTS'     // Thư mục chứa file video
//   });
  
//   server.listen(8000, () => {
//     console.log('Server is running on http://localhost:8000');
//   });

app.get('/renderejs', (req, ress) => {
    ress.render('index')
}) 

app.listen(3000, () => {
    console.log('Server start port 3000 app ')
//     oauth2Client.setCredentials(_tokens);
//     //test kiểm tra tokens
//     oauth2Client.on("tokens", (tokens) => {
//         if (tokens.refresh_token) {
//             // store the refresh_token in my database!

//             console.log('Lưu lại refresh_token: ' + tokens.refresh_token);
//         }

//         console.log('Giữ nguyên access_token: ' + tokens.access_token);
//     });

//     console.log('End Task')
//     // test_https()
//     //noifile()
//     //main()
})

