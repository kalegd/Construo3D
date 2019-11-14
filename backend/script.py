import falcon
import json
import os
import uuid

class Script:

    def on_post(self, req, resp):
        data_store = None
        with open('data_store.json') as (json_file):
            data_store = json.load(json_file)
        name = req.get_param('name')
        script = req.get_param('file')
        _, ext = os.path.splitext(script.filename)
        fields = json.loads(req.get_param('fields'))
        script_type = 'JS'
        script_class = req.get_param('class')
        script_id = '{uuid}'.format(uuid=(uuid.uuid4()))
        filename = 'library/scripts/{uuid}{ext}'.format(uuid=script_id, ext=ext)
        with open('website/' + filename, 'wb') as (target):
            buf = script.file.read(1048576)
            while buf:
                target.write(buf)
                buf = script.file.read(1024)

        file_record = {'name':name,
         'id':script_id,
         'type':script_type,
         'filename':filename,
         'class':script_class,
         'fields':fields}
        data_store['library']['scripts'].append(file_record)
        with open('data_store.json', 'w') as (json_file):
            json_file.write(json.dumps(data_store))
        body = {'status':'success',
         'data':{'script': file_record},
         'message':'Successfully added script'}
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

    def on_delete(self, req, resp):
        script_id = req.media['id']
        filename = req.media['filename']
        path = 'website/'
        if os.path.exists(path + filename):
            os.remove(path + filename)
        data_store = None
        with open('data_store.json') as (json_file):
            data_store = json.load(json_file)
        data_store['library']['scripts'].remove(req.media)
        for website in data_store['websites']:
            for page in website['pages']:
                if script_id in page['scripts']:
                    page['scripts'].pop(script_id)

        json_string = json.dumps(data_store).replace('"' + script_id + '"', 'null')
        with open('data_store.json', 'w') as (json_file):
            json_file.write(json_string)
        body = {'status':'success',
         'data':{'script': req.media},
         'message':'Successfully deleted script'}
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)
