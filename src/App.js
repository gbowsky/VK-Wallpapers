import React from 'react';
import connect from '@vkontakte/vk-connect';
import {View, ConfigProvider, Panel, ModalPageHeader, ModalPage, ModalRoot, ScreenSpinner, HeaderButton, FormLayout} from '@vkontakte/vkui/dist';
import '@vkontakte/vkui/dist/vkui.css';
import Unsplash, {toJson} from 'unsplash-js';
import Home from './panels/Home';
import Search from "./panels/Search";
import Icon24Dropdown from '@vkontakte/icons/dist/24/dropdown';
import FormLayoutGroupMini from "./components/FormLayoutGroupMini";
import * as Vibrant from 'node-vibrant';
import {Avatar, Button} from "@vkontakte/vkui";
import FormLayoutGroup from "@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup";
const unsplash = new Unsplash({ accessKey: "d7fe79e01ff196849274d5e9753e087326457498f414990bf054acbce9a0592a" });
class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'home',
			modal: null,
			activeModal: null,
			modalFunction: function (){},
			modalButtonText: 'Готово',
			modalContent: null,
			VK: true,
			query: "",
			palette: [],
			ignoreTheme: false,
		};
	}

	changeTheme = () => {
		this.setState({ignoreTheme:true});
		if (this.state.theme == "space_gray") {
			this.setState({theme:"client_light"});
			window.location.reload();
		}
		else {
			this.setState({theme:"space_gray"});
			require("./themes/dark.css");
		}
	}

	componentDidMount() {
		setInterval(()=>{
				if (this.state.ignoreTheme !== true) {
					let mql = window.matchMedia('(prefers-color-scheme: dark)');
					if (mql.matches == true) {
						this.setState({theme:"space_gray"});
					}
					else {
						this.setState({theme:"client_light"});
					}
				}
			}
			,100);

		connect.subscribe((e) => {
			switch (e.detail.type) {
				default:
				case 'VKWebAppGetUserInfoFailed':
					this.setState({VK:false});
					break;
			}
		});
	}

	go = (e) => {
		this.setState({ activePanel: e });
		window.history.pushState({panel: e}, e);

	};

	get = (e) => {
		this.setState({ activePanel: e });
		window.history.pushState({panel: e}, e);

	};

	setModalContent = (content) => {
		this.setState({modalContent: content});
	};

	setModalTitle = (title) => {
		this.setState({modalTitle: title});
	};

	setModalFunction = (callback) => {
		this.setState({modalButtonText: 'Готово'});
		this.state.modalFunction();
		this.setActiveModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
	};

	modalBack = () => {
		this.setState({modalButtonText: 'Готово'});
		this.setState({activeModal: null});
		this.state.modalFunction();
	};

	setActiveModal = (activeModal) => {
		activeModal = activeModal || null;
		let modalHistory = this.state.modalHistory ? [...this.state.modalHistory] : [];

		if (activeModal === null) {
			modalHistory = [];
		} else if (modalHistory.indexOf(activeModal) !== -1) {
			modalHistory = modalHistory.splice(0, modalHistory.indexOf(activeModal) + 1);
		} else {
			modalHistory.push(activeModal);
		}

		this.setState({
			activeModal,
			modalHistory
		});
	};

	Popout = (e) => {
		if(e){
			this.setState({ popout:
					e
			});
		}else{
			this.setState({popout: null});
		}
	};

	CallSearch = (query) => {
		console.log(query);
		this.setActiveModal(null);
		this.setState({query:query});
		this.setState({activePanel:"search"});
	}

	getPhotoData= (id) => {
		this.Popout(<ScreenSpinner/>);
		unsplash.photos.getPhoto(id).then(toJson)
			.then(json => {
				this.setState({palette:[]});
				let v = new Vibrant(json.urls.small);
				v.getPalette((err,pal)=>{
					for (let swatch in pal) {
						this.state.palette.push(
							<div className="palette_preview"
									style={{background:pal[swatch].hex,color:pal[swatch].titleTextColor}}
									onClick={()=>{connect.send("VKWebAppCopyText", {text: pal[swatch].hex});}}
							>
								{swatch}
							</div>
						);
					}
				});

				this.Popout();
				this.setModalTitle('Image');
				this.setModalContent(
					<FormLayout>
						<FormLayoutGroupMini title="Uploaded by">
							<center>
								{json.user.profile_image ? <Avatar src={json.user.profile_image.medium}/> : null}
								<div className="profile_name">{json.user.name}</div>
							</center>
						</FormLayoutGroupMini>
						<FormLayoutGroup top="Image">
							<img style={{width:"100%"}} src={json.urls.small}/>

						</FormLayoutGroup>
						{this.state.palette ? <FormLayoutGroupMini top="Color palette">
							{this.state.palette}

						</FormLayoutGroupMini> : ""}
						<FormLayoutGroupMini title="Actions">
							<Button component="a"
									size="xl"
									href={json.urls.raw}
									target="_blank"

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
							<div>Views: {json.views}</div>
							<div>Downloads: {json.downloads}</div>
							<div>Resolution: {json.width}x{json.height}</div>
						</FormLayoutGroupMini>
					</FormLayout>
				);
				this.setActiveModal('modal');
			});
	}

	render() {
		var modals = (
			<ModalRoot activeModal={this.state.activeModal} >
				<ModalPage
					id='modal'
					onClose={this.modalBack}
					header={
						<ModalPageHeader
							left={<div className="headermodal">{this.state.modalTitle}</div>}
							right={<HeaderButton
								onClick={this.modalBack}>
								<Icon24Dropdown/>
							</HeaderButton>}
						>
							{/**this.state.modalTitle**/}
						</ModalPageHeader>
					}
				>
					<div style={{paddingBottom: '10px'}}>
						{this.state.modalContent}
					</div>
				</ModalPage>
			</ModalRoot>
		);

		return (
			<ConfigProvider scheme={this.state.theme}>
				<View modal={modals} popout={this.state.popout} activePanel={this.state.activePanel}>
					<Home setActiveModal={this.setActiveModal}
						  setModalContent={this.setModalContent}
						  setModalFunction={this.setModalFunction}
						  setModalTitle={this.setModalTitle}
						  activatePopout={this.Popout}
						  getPhotoData={this.getPhotoData}
						  changeTheme={this.changeTheme}
						  isVK={this.state.VK}
						  id="home"
						  search={this.CallSearch}
						  go={this.go}/>
					<Search setActiveModal={this.setActiveModal}
						  setModalContent={this.setModalContent}
						  setModalFunction={this.setModalFunction}
						  setModalTitle={this.setModalTitle}
						  activatePopout={this.Popout}
							getPhotoData={this.getPhotoData}
						  isVK={this.state.VK}
						  id="search"
						  query={this.state.query}
						  go={this.go}/>
				</View>
			</ConfigProvider>
		);
	}
}

export default App;
