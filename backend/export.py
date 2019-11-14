from shutil import copy, copyfile, copytree, rmtree
from urllib.parse import parse_qs
import falcon
import io
import json
import os
import uuid
import zipfile

class Export():

    def on_get(self, req, resp):
        query_string = parse_qs(req.query_string)
        website_id = query_string['website-id'][0]
        page_id = query_string['page-id'][0]

        os.makedirs("page")
        os.makedirs("page/css")
        os.makedirs("page/scripts")
        os.makedirs("page/scripts/three")

        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        for website_record in data_store['websites']:
            if(website_record['id'] == website_id):
                for page_record in website_record['pages']:
                    if(page_record['id'] == page_id):
                        data = { "page": page_record, "library": data_store['library'] }
                        with open('page/page_info.json', 'w') as json_file:
                            json_file.write(json.dumps(data))

        copyfile("website/export-template.html", "page/index.html")
        copy("website/css/preview.css", "page/css/")
        copy("website/scripts/jquery-3.4.1.min.js", "page/scripts/")
        copy("website/scripts/GLTFAsset.js", "page/scripts/")
        copy("website/scripts/Floor.js", "page/scripts/")
        copy("website/scripts/Skybox.js", "page/scripts/")
        copy("website/scripts/Utilities.js", "page/scripts/")
        copy("website/scripts/Enums.js", "page/scripts/")
        copy("website/scripts/stats.min.js", "page/scripts/")
        copy("website/scripts/three/three.js", "page/scripts/three/")
        copy("website/scripts/three/WebVR.js", "page/scripts/three/")
        copy("website/scripts/three/PointerLockControls.js", "page/scripts/three/")
        copy("website/scripts/three/SkeletonUtils.js", "page/scripts/three/")
        copy("website/scripts/three/Water.js", "page/scripts/three/")
        copy("website/scripts/three/Reflector.js", "page/scripts/three/")
        copy("website/scripts/three/Refractor.js", "page/scripts/three/")
        copy("website/scripts/three/SVGLoader.js", "page/scripts/three/")
        copy("website/scripts/three/GLTFLoader.js", "page/scripts/three/")
        copytree("website/scripts/release", "page/scripts/release")
        copytree("website/textures", "page/textures")
        copytree("website/library", "page/library")

        file_paths = self.get_all_file_paths("page")
        file_like_object = io.BytesIO()
        with zipfile.ZipFile(file_like_object,'a', zipfile.ZIP_DEFLATED) as zip:
            # writing each file one by one
            for file in file_paths:
                zip.write(file)
        rmtree("page")

        resp.status = falcon.HTTP_200
        resp.downloadable_as = 'page.zip'
        resp.body = file_like_object.getvalue()

    def get_all_file_paths(self, directory):
        # initializing empty file paths list
        file_paths = []
        # crawling through directory and subdirectories
        for root, directories, files in os.walk(directory):
            for filename in files:
                # join the two strings in order to form the full filepath.
                filepath = os.path.join(root, filename)
                file_paths.append(filepath)
        # returning all file paths
        return file_paths
