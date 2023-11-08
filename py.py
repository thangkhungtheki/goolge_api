import requests

# Thông tin của bạn
access_token = 'ya29.a0AfB_byDToJJZBWL0lezvXoJU5j2MaADnOidbOaN_gfCX560G_PSNscQIj0jEalhVdiBDGPsdrjGLuc8VvOWh3_ubYTv41CBKRxCRwBvtqxrJ4WyfN6swII0w9ICHdFrtCbaR5HLA_cX9MuYmiipK1r8Qc4CXPvyPwOnbaCgYKAegSARASFQGOcNnCpegDEMPZ8L7rFwn9-597uw0171'
blog_id = '8907104054359847181'
image_path = 'tsfile.png'

# Đường dẫn API tải lên ảnh
upload_url = f'https://www.googleapis.com/upload/blogger/v3/blogs/{blog_id}/posts/upload'

# Tạo yêu cầu POST để tải lên ảnh
files = {'file': open(image_path, 'rb')}
headers = {'Authorization': f'Bearer {access_token}'}
response = requests.post(upload_url, headers=headers, files=files)

# Lấy URL của ảnh gốc từ phản hồi
if response.status_code == 200:
    image_info = response.json()
    media_url = image_info.get('mediaUrl', '')
    print(f'URL của ảnh gốc: {media_url}')
else:
    print(f'Lỗi khi tải lên ảnh: {response.status_code}')
