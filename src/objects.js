import React from 'react';
import Unsplash, {toJson} from 'unsplash-js';
import {Avatar, Button, FormLayout} from "@vkontakte/vkui";
import FormLayoutGroupMini from "./components/FormLayoutGroupMini";
import FormLayoutGroup from "@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup";
import connect from "@vkontakte/vk-connect";
const unsplash = new Unsplash({ accessKey: "faad61bb0c65e6e557fcf29cec0e6008152f8963ed4a0ac166cd6a0013414c3e" });

class objects {
    static  genPhotocardList(json) {
        var out = [];
        json.forEach(element => {
                console.log(element);
                out.push(
                    <img src={element.urls.small} className="img_obj" onClick={()=>{this.photoData(element.id);}}/>
                );
            }
        );
        return out;
    }

    static photoData(id) {
        var photo = unsplash.photos.getPhoto(id).then(toJson)
            .then(json => {
                this.props.setModalTitle('Image');
                this.props.setModalContent(
                    <FormLayout>
                        <FormLayoutGroupMini title="Uploaded by">
                            <center>
                                {json.user.profile_image ? <Avatar src={json.user.profile_image.medium}/> : null}
                                {json.user.name}
                            </center>
                        </FormLayoutGroupMini>
                        <FormLayoutGroup top="Image">
                            <img style={{width:"100%"}} src={json.urls.small}/>
                        </FormLayoutGroup>
                        <FormLayoutGroupMini title="Actions">
                            <Button component="a"
                                    size="xl"
                                    href={json.urls.raw}
                                    target="_self"
                                    download

                            >Download image</Button>
                            <div>
                                <Button size="xl"
                                        style={{marginTop:"4px"}}
                                        onClick={()=>{
                                            connect.send("VKWebAppShowImages", {
                                                images: [
                                                    json.urls.regular,
                                                ]
                                            });
                                        }}
                                >Open in Photo Viewer</Button>
                                <Button size="xl"
                                        style={{marginTop:"4px"}}
                                        onClick={()=>{
                                            connect.send("VKWebAppShowStoryBox",
                                                {background_type: "image", url : json.urls.regular });
                                        }}>Create story with this image</Button>
                            </div>
                        </FormLayoutGroupMini>
                        {json.description ? <FormLayoutGroupMini title="Description">
                            {json.description}
                        </FormLayoutGroupMini> : null}
                        {json.alt_description ? <FormLayoutGroupMini title="Alt. Description">
                            {json.alt_description}
                        </FormLayoutGroupMini> : null}
                        {json.tags ?
                            <FormLayoutGroupMini title="Tags">
                                {this.setState({tags:[]})}
                                {
                                    json.tags.forEach(tag => {
                                        if (tag.type === "search") {
                                            this.state.tags.push(
                                                <Button
                                                    level="tertiary"
                                                    onClick={
                                                        ()=>{
                                                            this.props.search(tag.title);
                                                            console.log(tag.title);
                                                        }
                                                    }
                                                >
                                                    {tag.title}
                                                </Button>
                                            )
                                        }
                                    })
                                }
                                {this.state.tags}
                            </FormLayoutGroupMini> : null
                        }
                        {json.exif.make ?
                            <FormLayoutGroupMini title="EXIF data">
                                <div>Device: {json.exif.make}</div>
                                <div>Model: {json.exif.model}</div>
                                <div>Exposure: {json.exif.exposure_time}</div>
                                <div>Aperture: {json.exif.aperture}</div>
                                <div>Focal length: {json.exif.focal_lenth}</div>
                                <div>ISO: {json.exif.iso}</div>
                            </FormLayoutGroupMini> : null}
                        <FormLayoutGroupMini title="Additional info">
                            <div>Likes: {json.likes}</div>
                            <div>Views: {json.views}</div>
                            <div>Downloads: {json.downloads}</div>
                            <div>Resolution: {json.width}x{json.height}</div>
                        </FormLayoutGroupMini>
                    </FormLayout>
                );
                this.props.setActiveModal('modal');
            });
    }
}

export default objects;

