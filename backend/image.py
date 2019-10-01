import falcon
import json
import os
import uuid

class Image():

    def on_post(self, req, resp):
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)
        name = req.get_param('name')
        image = req.get_param('file')
        _, ext = os.path.splitext(image.filename)
        image_id = "{uuid}".format(uuid=uuid.uuid4())
        filename = "library/images/{uuid}{ext}".format(uuid=image_id, ext=ext)
        with open('website/' + filename, 'wb') as target:
            buf = image.file.read(1048576) # 1 Megabyte
            while buf:
                target.write(buf)
                buf = image.file.read(1024)
        file_record = {
            'name': name,
            'id': image_id,
            'filename': filename
        }
        data_store['library']['images'].append(file_record)
        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'image': file_record,
            },
            'message': 'Successfully added image'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)
    def on_delete(self, req, resp):
        image_id = req.media['id']
        filename = req.media['filename']
        path = "website/"
        if(os.path.exists(path + filename)):
            os.remove(path + filename);
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        data_store['library']['images'].remove(req.media)
        # Replace any occurance of the asset as a parameter with null
        json_string = json.dumps(data_store).replace("\"" + image_id + "\"", "null")
        with open('data_store.json', 'w') as json_file:
            json_file.write(json_string)

        body = {
            'status': 'success',
            'data': { 'image': req.media },
            'message': 'Successfully deleted image'
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

