import React, {Component} from 'react';
import PropTypes from 'prop-types';

class FormLayoutGroupMini extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: <div className="mini_modal_header">{this.props.title}</div>,
        };
    }

    async componentDidMount() {
        if (this.props.title === undefined) {
            this.setState({title:null});
        }

    }

    render() {
        return(
            <div>
                {this.state.title}
                <div style={this.props.style} className="mini_modal_content">{this.props.children}</div>
            </div>
        );
    }
}
FormLayoutGroupMini.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    style: PropTypes.any,
};

export default FormLayoutGroupMini;
