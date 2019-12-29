import React from 'react';
import connect from '@vkontakte/vk-connect';
import Unsplash, {toJson} from 'unsplash-js';
import PropTypes from 'prop-types';
import {PanelHeader, Panel, HorizontalScroll, FormLayout, Button, Avatar, ScreenSpinner, Tabs, TabsItem, FixedLayout} from '@vkontakte/vkui/dist';
import "../styles/objects.css";
import "../styles/design.css";
import BigPanelHeader from "../components/BigPanelHeader";
import Icon24Search from '@vkontakte/icons/dist/24/search';
import HeaderButtonBPH from "../components/HeaderButtonBPH";
import Icon20LikeOutline from '@vkontakte/icons/dist/20/like_outline';
import BottomScrollListener from 'react-bottom-scroll-listener';

const unsplash = new Unsplash({ accessKey: "d7fe79e01ff196849274d5e9753e087326457498f414990bf054acbce9a0592a" });
class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			photos: <div></div>,
			tags: [],
			activeTab: 'latest',
			page: 1,
			max_pages: 0,
		}
	}
	componentDidMount() {
		this.setState({activeTab:"latest"});
		this.load();
	}

	genPhotocardList(json) {
		var out = [];
		json.forEach(element => {
				out.push(
					<div className="main_img" onClick={()=>{this.props.getPhotoData(element.id)}} style={{/*background:element.color*/}}>
						<img className="main_img_obj" src={element.urls.small}></img>
						<div className="main_img_info_block">
							<div className="main_img_author_pre">
								<Avatar size={32} style={{minWidth:32}} src={element.user.profile_image.medium}/>
								<div className="main_img_data">
									<div className="main_img_user">{element.user.name}</div>
									<div className="main_img_desc">{element.description ? element.description : "No description."}</div>
								</div>
							</div>
						</div>
						<div className="main_img_info_bar">
							<div className="main_img_likes">
								<Icon20LikeOutline className="main_img_likes_icon"/>
								<div className="main_img_likes_count">{element.likes}</div>
							</div>
						</div>
					</div>
				);
			}
		);
		return out;
	}



	load(type) {
		this.props.activatePopout(<ScreenSpinner/>);
		if (type == "more") {
			console.log(this.state.page);
			this.state.page += 1;
			unsplash.photos.listPhotos(this.state.page, 15, this.state.activeTab)
				.then(toJson)
				.then(json => {
					this.state.photos.push(this.genPhotocardList(json));
					this.props.activatePopout();
				});
			return;
		}
		else {
			this.setState({activeTab:type})
			this.setState({photos:<div></div>});
			unsplash.photos.listPhotos(this.state.page, 15, type)
				.then(toJson)
				.then(json => {
					this.setState({photos: this.genPhotocardList(json)});
					this.props.activatePopout();
				});
		}
	}

	callback() {
		this.load("more");
	}

	render() {
		return (
			<Panel id={this.props.id}>
				<PanelHeader
					noShadow
					left={<BigPanelHeader
						upper={
							<HeaderButtonBPH
								props={this.props}
								callBack={()=>{this.props.go("search")}}>
								<Icon24Search/>
							</HeaderButtonBPH>
						}
						title="wallpapers"/>}
				>

				</PanelHeader>
				<FixedLayout vertical="bottom">
					<Tabs theme="light" type="default">
						<HorizontalScroll>
							<TabsItem
								onClick={() => {this.load("latest"); this.setState({page:1});}}
								selected={this.state.activeTab === 'latest'}
							>
								Latest
							</TabsItem>
							<TabsItem
								onClick={()=>{this.load("popular"); this.setState({page:1});}}
								selected={this.state.activeTab === 'popular'}
							>
								Popular
							</TabsItem>
						</HorizontalScroll>
					</Tabs>
				</FixedLayout>
				<div className="content_page">
					<div className="content_page_list">
						<BottomScrollListener onBottom={()=>{this.callback("more")}}>{this.state.photos}</BottomScrollListener>
					</div>
				</div>
			</Panel>
		);
	}
}


Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	setModalContent: PropTypes.func.isRequired,
	setModalTitle: PropTypes.func.isRequired,
	setModalFunction: PropTypes.func.isRequired,
	setActiveModal: PropTypes.func.isRequired,
	activatePopout: PropTypes.func.isRequired,
};

export default Home;