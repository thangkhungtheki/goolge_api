const axios = require('axios');
const fs = require('fs');
const { spawn } = require('child_process');

// URL của tệp M3U8 và header bạn muốn gửi
const m3u8Url = 'https://storage.googleapiscdn.com/playlist/6518592ef1a004b509f84c8d/playlist.m3u8';
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0', // Thay bằng User Agent của bạn
  'origin': 'https://animevietsub.fan',
  'referer': 'https://animevietsub.fan/',
  'Accept': '*/*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'Connection'
  // Thêm các header khác nếu cần
};

// Tải tệp M3U8 với header
axios.get(m3u8Url, { headers })
  .then(response => {
    const m3u8Content = response.data;

    // Lưu tệp M3U8 vào một tệp cục bộ
    fs.writeFileSync('playlist.m3u8', m3u8Content);

    // Sử dụng ffmpeg để chuyển đổi M3U8 thành video
    const ffmpeg = spawn('ffmpeg', [
      '-i', 'playlist.m3u8',
      '-c', 'copy',
      'output.mp4'
    ]);

    ffmpeg.stdout.on('data', (data) => {
      //console.log(`stdout: ${data}`);
      console.log('hahaha')
    });

    ffmpeg.stderr.on('data', (data) => {
      //console.error(`stderr: ${data}`);
      console.log('hihihi')
      console.log(data.toString())
    //   axios.get('https:' + data.toString(),{headers})
    //   .then(response => {
    //     console.log(response)
    //   })
    });

    ffmpeg.on('close', (code) => {
      console.log(`ffmpeg process exited with code ${code}`);
    });
  })
  .catch(error => {
    console.error('Error downloading M3U8:', error);
  });
