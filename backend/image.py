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
        filename = "{uuid}{ext}".format(uuid=uuid.uuid4(), ext=ext)
        with open('website/library/images/' + filename, 'wb') as target:
            buf = image.file.read(1048576) # 1 Megabyte
            while buf:
                target.write(buf)
                buf = image.file.read(1024)
        file_record = {
            'name': name,
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
        name = req.media['name']
        filename = req.media['filename']
        path = "website/library/images/"
        if(os.path.exists(path + filename)):
            os.remove(path + filename);
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        data_store['library']['images'].remove({'name': name, 'filename': filename})
        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'image': {
                    'name': name,
                    'filename': filename
                }
            },
            'message': 'Successfully deleted image'
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

