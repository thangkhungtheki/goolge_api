const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0', // Thay bằng User Agent của bạn
    'origin': 'https://animevietsub.fan',
    'referer': 'https://animevietsub.fan/',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'Connection'
    // Thêm các header khác nếu cần
  };

// Đường dẫn đến tệp M3U8 cần xử lý
const m3u8FilePath = 'playlist.m3u8';

// Hàm để tải và xử lý tệp .ts
async function processTsFile(tsUrl, outputFileName) {
    //console.log(tsUrl)
    try {
      await axios.get('//storage.googleapiscdn.com/chunks/651859cf299fe2215a7f2de6/original/DBcZHSxRWyBLVRlCVzIAAV1FAwwCCjMRHRILFTwICwAJBxpFBwwASG0yAikMXhIPECYjIRlTJVcGXWxMWkwXDQgLNRwuPC0PJSk6ImcbUQUiXiYJXEczJDgPXRFaIwouGiwxXjATKU0JPy0uIQAiBx0bW1QWJjNfBDIbJxleFzM4WygfMRUnED1eFDIiHwwcMSkrQC0HI1FbEzgqI0MbMzcfNQhdSGwwDA/video0.html', {headers})
      .then(response => {
        
        console.log('https://lh3.googleusercontent.com' + response.request['path'])
      })
      
    } catch (error) {
      console.error('Error downloading .ts file:', error);
    }
  }

async function processM3u8File(filePath) {
    try {
      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });
      
      for await (const line of rl) {
        
        if (line.startsWith('#EXTINF:')) {
          // Xử lý thông tin tệp .ts (nếu cần)
          //console.log(line)
        } else if (line.endsWith('.html')) {
          const tsUrl = 'https:' + line; // URL của tệp .ts
          console.log(tsUrl)
          const outputFileName = tsUrl.split('/').pop(); // Tên tệp đầu ra
          await processTsFile(tsUrl, outputFileName);
        }
        
      }
    } catch (error) {
      console.error('Error processing M3U8 file:', error);
    }
  }
  processM3u8File(m3u8FilePath);