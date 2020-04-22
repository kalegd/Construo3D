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
        if(ext == ".js"):
            fields = json.loads(req.get_param("fields"))
            model_type = "JS"
            model_class = req.get_param("class")
        else:
            fields = [
                {   
                    "name": "Scale",
                    "type": "float",
                    "default": 1
                },
                {   
                    "name": "Initial X Position",
                    "type": "float",
                    "default": 0
                },
                {   
                    "name": "Initial Y Position",
                    "type": "float",
                    "default": 0
                },
                {   
                    "name": "Initial Z Position",
                    "type": "float",
                    "default": 0
                },
                {
                    "name": "Initial X Rotation",
                    "type": "degrees",
                    "default": 0
                },
                {
                    "name": "Initial Y Rotation",
                    "type": "degrees",
                    "default": 0
                },
                {
                    "name": "Initial Z Rotation",
                    "type": "degrees",
                    "default": 0
                }
            ]
            model_type = "GLB"
            model_class = "GLTFAsset"
        model_id = "{uuid}".format(uuid=uuid.uuid4())
        filename = "/library/models/{uuid}{ext}".format(uuid=model_id, ext=ext)
        with open('frontend/' + filename, 'wb') as target:
            buf = model.file.read(1048576) # 1 Megabyte
            while buf:
                target.write(buf)
                buf = model.file.read(1024)
        file_record = {
            'name': name,
            'id': model_id,
            'type': model_type,
            'filename': filename,
            'class': model_class,
            'fields': fields,
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
        model_id = req.media['id']
        filename = req.media['filename']
        path = "frontend/"
        if(os.path.exists(path + filename)):
            os.remove(path + filename);
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        data_store['library']['models'].remove(req.media)
        # Delete references in websites 
        for website in data_store['websites']:
            for page in website['pages']:
                if(model_id in page['assets']):
                    page['assets'].pop(model_id)
        # Replace any occurance of the asset as a parameter with null
        json_string = json.dumps(data_store).replace("\"" + model_id + "\"", "null")
        with open('data_store.json', 'w') as json_file:
            json_file.write(json_string)

        body = {
            'status': 'success',
            'data': { 'model': req.media },
            'message': 'Successfully deleted model'
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

