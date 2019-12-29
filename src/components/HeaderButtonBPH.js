import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from "@vkontakte/vkui";

class BigHead extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    async componentDidMount() {

    }

    render() {
        return(
            <div style={{display:"flex"}}>
                <Button onClick={()=>{this.props.callBack();}} className="header_button" level="tertiary">
                    <div className="header_button_in">
                        {this.props.children}
                    </div>
                </Button>
                <div>
                    {this.props.asideContent}
                </div>
            </div>
        );
    }
}
BigHead.propTypes = {
    children: PropTypes.node,
    asideContent: PropTypes.node,
    callBack: PropTypes.func,
    props: PropTypes.any,
};

export default BigHead;
