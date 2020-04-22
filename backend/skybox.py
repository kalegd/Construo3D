import falcon
import json
import os
import uuid

class Skybox():

    def on_post(self, req, resp):
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)
        name = req.get_param('name')
        preview = req.get_param('preview')
        front = req.get_param('front')
        left = req.get_param('left')
        right = req.get_param('right')
        back = req.get_param('back')
        top = req.get_param('top')
        bottom = req.get_param('bottom')
        files = [
            { 'name': 'front', 'file': front},
            { 'name': 'left', 'file': left },
            { 'name': 'right', 'file': right },
            { 'name': 'back', 'file': back },
            { 'name': 'top', 'file': top },
            { 'name': 'bottom', 'file': bottom }
        ]
        path = 'frontend/'
        skybox_id = "{uuid}".format(uuid=uuid.uuid4())
        os.makedirs(path + "library/skyboxes/" + skybox_id)
        skybox_record = { 'name': name, 'id': skybox_id }
        for skybox_file in files:
            _, ext = os.path.splitext(skybox_file['file'].filename)
            filename = '/library/skyboxes/' + skybox_id + '/' + skybox_file['name'] + ext
            with open(path + filename, 'wb') as target:
                buf = skybox_file['file'].file.read(1048576) # 1 Megabyte
                while buf:
                    target.write(buf)
                    buf = skybox_file['file'].file.read(1024)
            skybox_record[skybox_file['name']] = filename
            if(preview == skybox_file['name']):
                skybox_record['preview'] = filename

        data_store['library']['skyboxes'].append(skybox_record)
        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'skybox': skybox_record,
            },
            'message': 'Successfully added skybox'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

    def on_put(self, req, resp):
        name = req.media['name']
        skybox_id = req.media['id']
        preview = req.media['preview']

        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        skybox_return_record = None

        for skybox_record in data_store['library']['skyboxes']:
            if(skybox_record['id'] == skybox_id):
                skybox_record['name'] = name
                skybox_record['preview'] = skybox_record[preview]
                skybox_return_record = skybox_record
                break;

        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': { 'skybox': skybox_return_record },
            'message': 'Successfully updated skybox'
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

    def on_delete(self, req, resp):
        skybox_id = req.media['id']
        filenames = [req.media['front'], req.media['back'], req.media['left'], req.media['right'], req.media['top'], req.media['bottom']]
        path = "frontend/"
        for filename in filenames:
            if(os.path.exists(path + filename)):
                os.remove(path + filename);
        os.rmdir(path + "library/skyboxes/" + skybox_id)

        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        data_store['library']['skyboxes'].remove(req.media)
        #delete references in websites
        for website in data_store['websites']:
            for page in website['pages']:
                if(skybox_id == page['skybox']['skybox_id']):
                    page['skybox']['skybox_id'] = None
        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': { 'skybox': req.media },
            'message': 'Successfully deleted skybox'
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

