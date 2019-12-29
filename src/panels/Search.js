import React from 'react';
import connect from '@vkontakte/vk-connect';
import Unsplash, {toJson} from 'unsplash-js';
import PropTypes from 'prop-types';
import {
    PanelHeader,
    Panel,
    Avatar,
    Button,
    FormLayout,
    Input

} from '@vkontakte/vkui/dist';

import Icon24Back from '@vkontakte/icons/dist/24/back'
import BigPanelHeader from "../components/BigPanelHeader";
import FormLayoutGroup from "@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup";
import FormLayoutGroupMini from "../components/FormLayoutGroupMini";
import ScreenSpinner from "@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner";
import Icon16Down from '@vkontakte/icons/dist/16/down';
import BottomScrollListener from 'react-bottom-scroll-listener';
const unsplash = new Unsplash({ accessKey: "d7fe79e01ff196849274d5e9753e087326457498f414990bf054acbce9a0592a" });


class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            page: 1,
            max_pages: 0,
            bar: "none",
            bla: false,
        }
    }
    componentDidMount() {
        if (this.props.query !== "") {

            console.log(this.props.query);
            this.setState({query:this.props.query});
            this.query(this.props.query, false);

        }

    }

    genPhotocardList = (json) => {
        var out = [];
        json.results.forEach(element => {
                out.push(
                    <img src={element.urls.small}
                         className="search_img_obj"
                         onClick={
                             ()=>{
                                 this.props.getPhotoData(element.id)
                             }
                         }
                    />
                );
            }
        );
        return out;
    }

    query = (e, a) => {
        this.props.activatePopout(<ScreenSpinner/>);;
        this.setState({query:e});
        unsplash.search.photos(e, this.state.page, 15, { orientation: "portrait" })
            .then(toJson)
            .then(json => {
                this.setState({max_pages:json.total_pages});
                if(a === true){
                    this.state.page +=1;
                    let b = <div id="search_block">{this.genPhotocardList(json)}</div>
                    this.state.result.push(b);
                } else {
                    this.state.page +=1;
                    this.setState({result:this.genPhotocardList(json)});
                    this.setState({'bar':"flex"});
                }
                this.props.activatePopout("");
            });
    }

    handleChange = (e) => {
        this.setState({query: e.target.value});
        this.setState({page: 1});
    }

    handleKeyCode = (e) => {
        if(e.keyCode === 13) {
            this.query(this.state.query, false);
        }
    }

    callback = (e) => {
        if (this.state.page != this.state.max_pages) {
            this.query(this.state.query, true);
        }
    }

    render() {
        return (
            <Panel id={this.props.id}>
                <PanelHeader
                    noShadow
                    left={<BigPanelHeader
                        title="Search"
                        upper={
                            <div style={{display:"flex"}}>
                                <Button onClick={()=>{this.props.go('home');}} className="header_button" level="tertiary">
                                    <div className="header_button_in">
                                        <Icon24Back/>
                                    </div>
                                </Button>
                            </div>
                        }
                    />}
                >
                </PanelHeader>
                <div className="content_page" >
                    <FormLayoutGroupMini>
                        <Input onChange={this.handleChange} key placeholder="e.g.: Books"/>
                        <Button size="xl" stretched style={{marginTop:"8px"}} onClick={()=>{this.query(this.state.query)}}>Search</Button>
                        <FormLayoutGroupMini id="results" title={"Results"}>
                            <BottomScrollListener onBottom={this.callback}>{this.state.result}</BottomScrollListener>
                            <div style={{display:this.state.bar}}>
                                <Button
                                    onClick={()=>{
                                        window.scrollTo({top:0,behavior:"smooth"});
                                    }}
                                ><Icon16Down className="show_to_top"/></Button>
                            </div>
                        </FormLayoutGroupMini>
                    </FormLayoutGroupMini>
                </div>
            </Panel>
        );
    }
}


Search.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    setModalContent: PropTypes.func.isRequired,
    setModalTitle: PropTypes.func.isRequired,
    setModalFunction: PropTypes.func.isRequired,
    setActiveModal: PropTypes.func.isRequired,
    activatePopout: PropTypes.func.isRequired,
    isVK: PropTypes.func.isRequired,
    query: PropTypes.string,
};

export default Search;