import React from "react";
import Records_CN from "./CentralPayment/CN/Records_CN";
import Records_THVN from "./CentralPayment/THVN/Records_THVN";
import { connect } from "react-redux";
import actions from "$LIB/redux/actions/index";


class Records extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.hideNavBar();
    }

    componentWillUnmount() {
        this.props.userInfo_getBalance(true);
        this.props.userInfo_updateMemberInfo();

    }

    hideNavBar = () => {
        this.props.navigation &&
            this.props.navigation.setParams({
                hideNavBar: true,
            });
    };

    render() {
        switch (window.LANGUAGE) {
            case "CN":
                return <Records_CN></Records_CN>;
            case "TH":
            case "VN":
                return <Records_THVN {...this.props}></Records_THVN>;
            default:
                return <Records_CN></Records_CN>;
        }
    }
}

const mapStateToProps = state => ({

});
const mapDispatchToProps = dispatch => ({
    userInfo_updateMemberInfo: data => dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
    userInfo_getBalance: (forceUpdate = false) => dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Records);