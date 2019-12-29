import React, {Component} from 'react';
import PropTypes from 'prop-types';

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
            <div style={{
                fontSize:"18px",
                fontWeight:"500",
                padding:"4px 12px",
                color:"var(--bighead_text)",
            }}>
                {this.props.children}
            </div>
        );
    }
}
BigHead.propTypes = {
    children: PropTypes.node,
};

export default BigHead;
