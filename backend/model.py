import falcon
import json
import os
import uuid

class Model():

    def on_post(self, req, resp):
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)
        name = req.get_param('name')
        model = req.get_param('file')
        _, ext = os.path.splitext(model.filename)
        model_id = "{uuid}".format(uuid=uuid.uuid4())
        filename = "library/models/{uuid}{ext}".format(uuid=model_id, ext=ext)
        with open('website/' + filename, 'wb') as target:
            buf = model.file.read(1048576) # 1 Megabyte
            while buf:
                target.write(buf)
                buf = model.file.read(1024)
        file_record = {
            'name': name,
            'id': model_id,
            'type': 'GLB',
            'filename': filename,
            'class': 'GLTFAsset',
            'fields': [
                {
                    "name": "Scale",
                    "type": "float",
                    "default": 1
                },
                {
                    "name": "Initial X",
                    "type": "float",
                    "default": 0
                },
                {
                    "name": "Initial Y",
                    "type": "float",
                    "default": 0
                },
                {
                    "name": "Initial Z",
                    "type": "float",
                    "default": 0
                },
                {
                    "name": "Initial Rotation X",
                    "type": "degrees",
                    "default": 0
                },
                {
                    "name": "Initial Rotation Y",
                    "type": "degrees",
                    "default": 0
                },
                {
                    "name": "Initial Rotation Z",
                    "type": "degrees",
                    "default": 0
                }
            ],
            "versions": []
        }
        data_store['library']['models'].append(file_record)
        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'model': file_record,
            },
            'message': 'Successfully added model'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

    def on_delete(self, req, resp):
        name = req.media['name']
        filename = req.media['filename']
        path = "website/"
        if(os.path.exists(path + filename)):
            os.remove(path + filename);
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        data_store['library']['models'].remove(req.media)
        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': { 'model': req.media },
            'message': 'Successfully deleted model'
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

