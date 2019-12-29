import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {IS_PLATFORM_ANDROID, IS_PLATFORM_IOS} from '@vkontakte/vkui/dist';
class BigPanelHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            padding: "",
        };
    }

    async componentDidMount() {
        if (IS_PLATFORM_ANDROID === true) {
            this.setState({padding: "0px 8px"});
        }
    }

    render() {
        return(
            <div className="header" style={{padding: this.state.padding}}>
                <div className="header_s">
                    {this.props.upper}
                </div>
                <div style={{display:"flex"}}>
                    <div className="header_l">
                        {this.props.left}
                    </div>
                    <div className="header_b" >
                        {this.props.title}
                    </div>
                </div>
            </div>
        );
    }
}
BigPanelHeader.propTypes = {
    upper: PropTypes.node,
    left: PropTypes.node,
    title: PropTypes.string,
};

export default BigPanelHeader;
