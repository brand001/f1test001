import React from "react";

import Deposit_CN from "./CentralPayment/CN/Deposit_CN";
import Deposit_THVN from "./CentralPayment/THVN/Deposit/index";
import { GetSelfExclusionPopup } from "$Utils";
import { connect } from "react-redux";
import actions from "$LIB/redux/actions/index";

class DepositCenter extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {

        this.hideNavBar();

    }


    componentWillUnmount() {
        this.props.userInfo_getBalance(true);
        this.props.userInfo_updateMemberInfo();

    }

    hideNavBar = () => {
        this.props.navigation.setParams({
            hideNavBar: true,
        });
    };

    render() {
        switch (window.LANGUAGE) {
            case "CN":
                return <Deposit_CN {...this.props}></Deposit_CN>;
            case "TH":
                return <Deposit_THVN {...this.props}></Deposit_THVN>;
            case "VN":
                return <Deposit_THVN {...this.props}></Deposit_THVN>;
            default:
                return <Deposit_CN {...this.props}></Deposit_CN>;
        }
    }
}


const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    userInfo_updateMemberInfo: data => dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
    userInfo_getBalance: (forceUpdate = false) => dispatch(actions.ACTION_UserInfo_getBalanceAll(forceUpdate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DepositCenter);
