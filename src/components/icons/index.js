import React from "react";
import { View, Animated } from "react-native";
import Touch from "react-native-touch-once";

import AddRing from "./AddRing";
import AddFill from "./AddFill";
import Arrow from "./Arrow";
import Aviator from "./Aviator";
import AviatorActive from "./AviatorActive";
import Checked from "./Checked";
import Clear from "./Clear";
import Close from "./Close";
import Copy from "./Copy";
import Delete from "./Delete";
import Download from "./Download";
import DropDown from "./Dropdown";
import Edit from "./Edit";
import FailFill from "./FailFill";
import FailRing from "./FailRing";
import Filter from "./Filter";
import FilterSet from "./FilterSet";
import Home from "./Home";
import HomeActive from "./HomeActive";
import HomeCn from "./HomeCn";
import HomeCnActive from "./HomeCnActive";
import More from "./More";
import Pls from "./Pls";
import ProCn from "./ProCn";
import ProCnActive from "./ProCnActive";
import Profile from "./Profile";
import ProfileActive from "./ProfileActive";
import ProTH from "./ProTh";
import ProTHActive from "./ProThActive";
import ProVN from "./ProVn";
import ProVNActive from "./ProVnActive";
import Record from "./Record";
import RecordActive from "./RecordActive";
import Refresh from "./Refresh";
import RefreshGame from "./RefreshGame";
import Search from "./Search";
import Share from "./Share";
import Smart from "./Smart";
import SmartActive from "./SmartActive";
import SuccessFill from "./SuccessFill";
import SuccessRing from "./SuccessRing";
import Time from "./Time";
import WarningFill from "./WarningFill";
import WarningRing from "./WarningRing";
import SbHomeCN from "./SbHomeCn";
import SbHomeCnActive from "./SbHomeCnActive";
import SbRecordCN from "./SbRecordCn";
import SbRecordCNActive from "./SbRecordCnActive";
import SbSetting from "./SbSetting";
import Infor from "./Infor";
import Duration from "./Duration";
import User from "./User";
import Password from "./Password";
import Phone from "./Phone";
import Email from "./Email";
import Code from "./Code";
import EyeHide from "./EyeHide";
import EyeShow from "./EyeShow";
import Sort from "./Sort";
import Crown from "./Crown";
import Star from "./Star";
import Diamond from "./Diamond";
import Lock from "./Lock";
import LogoM1 from "./LogoM1";
import LogoM23 from "./LogoM23";
import Cn from "./Cn";
import Th from "./Th";
import Vn from "./Vn";
import Maintenance from "./Maintenance";
import Face from "./Face";
import Fingerprin from "./Fingerprin";
import Patter from "./Patter";
import ZoomIn from "./ZoomIn";
import ZoomOut from "./ZoomOut";
import Bell from "./Bell";
import Calendar from "./Calendar";
import Wallet from "./Wallet";
import SlotWallet from "./SlotWallet";
import CasinoWallet from "./CasinoWallet";
import FishWallet from "./FishWallet";
import InstantWallet from "./InstantWallet";
import LotteryWallet from "./LotteryWallet";
import P2PWallet from "./P2PWallet";
import SportWallet from "./SportWallet";
import EsportWallet from "./EsportWallet";
import All from "./All";
import Hot from "./Hot";
import ArrowLine from "./ArrowLine";
import InforNormal from "./InforNormal";
import BackTop from "./BackTop";
import BankCard from "./BankCard";
import AboutUsdt from "./AboutUsdt";
import Contactcs from "./Contactcs";
import DownloadApp from "./DownloadApp";
import LanguageSetting from "./LanguageSetting";
import PromotionsAddress from "./PromotionsAddress";
import SecurityCode from "./SecurityCode";
import SelfExclusion from "./SelfExclusion";
import SetLogin from "./SetLogin";
import Sponsor from "./Sponsor";
import Union from "./Union";
import UploadFile from "./UploadFile";
import UserInfor from "./UserInfor";
import UserRule from "./UserRule";
import Version from "./Version";
import DepositCn from "./DepositCn";
import DepositTh from "./DepositTh";
import DepositVn from "./DepositVn";
import DiamondClub from "./DiamondClub";
import Friend from "./Friend";
import KingClub from "./KingClub";
import News from "./News";
import Recordes from "./Recordes";
import Transfer from "./Transfer";
import Withdrawal from "./Withdrawal";
import UserLogin from "./UserLogin";
import UserGuest from "./UserGuest";
import DepositVerify from "./DepositVerify";
import NoRecord from "./NoRecord";
import HandPointerLeft from "./HandPointerLeft";
import Like from "./Like";
import Ctc from "./Ctc";
import LB from "./Lb";
import Restrict from "./Restrict";
import OtpPhone from "./OtpPhone";
import OtpMail from "./OtpMail";
import OtpCst from "./OtpCs";
import KycGuide from "./KycGuide";
import NoData from "./NoData";
import KycApproved from "./KycApproved";
import KycPending from "./KycPending";
import KycRejected from "./KycRejected";
import KycVerifying from "./KycVerifying";
import Cs from "./Cs";
import LevelId from "./LevelId";
import LevelPhone from "./LevelPhone";
import LevelMail from "./LevelMail";
import Usdt7 from "./Usdt7";
import Usdt8 from "./Usdt8";
import Usdt9 from "./Usdt9";
import VerificationPhone from "./VerificationPhone";
import VerificationVoice from "./VerificationVoice";
import VerificationZala from "./VerificationZala";
import VerificationMail from "./VerificationMail";
import RafMail from "./RafMail";
import RafPhone from "./RafPhone";
import RafTurnover from "./RafTurnover";
import RafDepositCn from "./RafDepositCn";
import RafDepositTh from "./RafDepositTh";
import RafDepositVn from "./RafDepositVn";
import RafUser from "./RafUser";










import { RowCenterCenter } from "$Components/CustomView";


export const AviatorIcon = Aviator;
export const AviatorActiveIcon = AviatorActive;


export const RecordSbIcon = props => {
    const { language = "CN", ...rest } = props;
    switch (language) {
        case "CN":
            return <SbRecordCN width={25} height={24} {...rest} />;
        default:
            return <SbRecordCN width={25} height={24} {...rest} />;
    }
};

export const RecordSbActiveIcon = props => {
    const { language = "CN", ...rest } = props;
    switch (language) {
        case "CN":
            return <SbRecordCNActive width={25} height={24} {...rest} />;
        default:
            return <SbRecordCNActive width={25} height={24} {...rest} />;
    }
};



export const HomeSbIcon = props => {
    const { language = "CN", ...rest } = props;
    switch (language) {
        case "CN":
            return <SbHomeCN width={56} height={34} {...rest} />;
        default:
            return <SbHomeCN width={56} height={34} {...rest} />;
    }
};
export const HomeSbActiveIcon = props => {
    const { language = "CN", ...rest } = props;
    switch (language) {
        case "CN":
            return <SbHomeCnActive width={56} height={34} {...rest} />;
        default:
            return <SbHomeCnActive width={56} height={34} {...rest} />;
    }
};

export const HomeIcon = props => {
    const { language = "CN", ...rest } = props;
    switch (language) {
        case "CN":
            return <HomeCn {...rest} />;
        default:
            return <Home {...rest} />;
    }
};

export const HomeActiveIcon = props => {
    const { language = "CN", ...rest } = props;
    switch (language) {
        case "CN":
            return <HomeCnActive {...rest} />;
        default:
            return <HomeActive {...rest} />;
    }
};

export const ProIcon = props => {
    const { language = "CN", ...rest } = props;
    switch (language) {
        case "CN":
            return <ProCn {...rest} />;
        case "TH":
            return <ProTH {...rest} />;
        case "VN":
            return <ProVN {...rest} />;
        default:
            return <ProCn {...rest} />;
    }
};

export const ProActiveIcon = props => {
    const { language = "CN", ...rest } = props;
    switch (language) {
        case "CN":
            return <ProCnActive {...rest} />;
        case "TH":
            return <ProTHActive {...rest} />;
        case "VN":
            return <ProVNActive {...rest} />;
        default:
            return <ProCnActive {...rest} />;
    }
};

export const ProfileIcon = Profile;
export const ProfileActiveIcon = ProfileActive;

export const RecordIcon = Record;
export const RecordActiveIcon = RecordActive;

export const SmartIcon = Smart;
export const SmartActiveIcon = SmartActive;

// fill="currentColor"
///  npx @svgr/cli ./src/components/icons/svg/*.svg --native -d ./src/components/icons
//   npx @svgr/cli ./src/components/icons/svg/levelId.svg --native -d ./src/components/icons
//   npx @svgr/cli ./src/components/icons/svg/rafDepositCn.svg --native -d ./src/components/icons
// d
// npx prettier --write .
// npx @svgr/cli ./src/components/icons/svg/*.svg \
//   --native \
//   --icon \
//   --expand-props start 
//   -d ./src/components/icons
// npm run lint:error-only

const withWrapper = Component => props => {
    const { wrapStyle = {}, onPress, ...rest } = props;

    const Wrapper = onPress ? Touch : View;

    return (
        <Wrapper style={[{ alignSelf: "center", }, wrapStyle]} onPress={onPress}>
            <Component {...rest} />
        </Wrapper>
    );
};

const AnimatedArrow = props => {
    let { direction = "left", ...rest } = props;
    const rotationMap = {
        left: "0deg", // 默认朝左
        right: "180deg",
        top: "90deg",
        bottom: "-90deg",
    };

    const rotationAnim = React.useRef(new Animated.Value(direction === "top" ? 1 : 0)).current;
    const prevDirection = React.useRef(direction);

    React.useEffect(() => {
        if (prevDirection.current !== direction) {
            if (direction === "top" || direction === "bottom") {
                Animated.timing(rotationAnim, {
                    toValue: direction === "top" ? 1 : 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            }
            prevDirection.current = direction;
        }
    }, [direction]);

    const rotation = direction === "left" || direction === "right"
        ? rotationMap[direction] // 左右方向使用静态旋转
        : rotationAnim.interpolate({ // 上下方向使用动画旋转
            inputRange: [0, 1],
            outputRange: ["-90deg", "90deg"]
        });

    return (
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Arrow {...rest} />
        </Animated.View>
    );
};

export const ArrowIcon = withWrapper(AnimatedArrow);

export const CopyIcon = withWrapper(Copy);
export const DeleteIcon = withWrapper(Delete);
export const FilterIcon = withWrapper(Filter);
export const FilterSetIcon = withWrapper(FilterSet);
export const PlsIcon = withWrapper(Pls);
export const SearchIcon = withWrapper(Search);
export const ShareIcon = withWrapper(Share);
export const TimeIcon = withWrapper(Time);
export const CloseIcon = withWrapper(Close);
export const RefreshIcon = props => {
    const { wrapStyle = {}, onPress, ...rest } = props;
    const spinAnim = React.useRef(new Animated.Value(0)).current;

    const handlePress = () => {
        spinAnim.setValue(0);
        Animated.timing(spinAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
        onPress?.();
    };

    const rotation = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
    });

    return (
        <Touch style={wrapStyle} onPress={handlePress}>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Refresh {...rest} />
            </Animated.View>
        </Touch>
    );
};
export const RefreshGameIcon = props => {
    const { wrapStyle = {}, onPress, ...rest } = props;
    const spinAnim = React.useRef(new Animated.Value(0)).current;

    const handlePress = () => {
        spinAnim.setValue(0);
        Animated.timing(spinAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
        onPress?.();
    };

    const rotation = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
    });

    return (
        <Touch style={wrapStyle} onPress={handlePress}>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <RefreshGame {...rest} />
            </Animated.View>
        </Touch>
    );
};
export const DownloadIcon = withWrapper(Download);
export const EditIcon = withWrapper(Edit);

export const CheckedIcon = withWrapper(Checked);
export const DropDownIcon = withWrapper(DropDown);
export const ClearIcon = withWrapper(Clear);
export const InforIcon = withWrapper(Infor);
export const DurationIcon = withWrapper(Duration);
export const UserIcon = withWrapper(User);
export const PasswordIcon = withWrapper(Password);
export const PhoneIcon = withWrapper(Phone);
export const EmailIcon = withWrapper(Email);
export const CodeIcon = withWrapper(Code);
export const SortIcon = withWrapper(Sort);
export const CrownIcon = withWrapper(Crown);
export const StarIcon = withWrapper(Star);
export const DiamondIcon = withWrapper(Diamond);
export const LockIcon = withWrapper(Lock);
export const LogoM1Icon = withWrapper(LogoM1);
export const LogoM23Icon = withWrapper(LogoM23);
export const CnIcon = withWrapper(Cn);
export const ThIcon = withWrapper(Th);
export const VnIcon = withWrapper(Vn);
export const MaintenanceIcon = withWrapper(Maintenance);
export const FaceIcon = withWrapper(Face);
export const FingerprinIcon = withWrapper(Fingerprin);
export const PatterIcon = withWrapper(Patter);
export const ZoomInIcon = withWrapper(ZoomIn);
export const ZoomOutIcon = withWrapper(ZoomOut);
export const BellIcon = withWrapper(Bell);
export const CalendarIcon = withWrapper(Calendar);
export const SlotWalletIcon = withWrapper(SlotWallet);
export const CasinoWalletIcon = withWrapper(CasinoWallet);
export const FishWalletIcon = withWrapper(FishWallet);
export const InstantWalletIcon = withWrapper(InstantWallet);
export const LotteryWalletIcon = withWrapper(LotteryWallet);
export const P2PWalletIcon = withWrapper(P2PWallet);
export const SportWalletIcon = withWrapper(SportWallet);
export const EsportWalletIcon = withWrapper(EsportWallet);
export const WalletIcon = withWrapper(Wallet);
export const HotIcon = withWrapper(Hot);
export const AllIcon = withWrapper(All);
export const InforNormalIcon = withWrapper(InforNormal);
export const BackTopIcon = withWrapper(BackTop);
export const BankCardIcon = withWrapper(BankCard);
export const AboutUsdtIcon = withWrapper(AboutUsdt);
export const LanguageSettingIcon = withWrapper(LanguageSetting);
export const PromotionsAddressIcon = withWrapper(PromotionsAddress);
export const SecurityCodeIcon = withWrapper(SecurityCode);
export const SelfExclusionIcon = withWrapper(SelfExclusion);
export const SetLoginIcon = withWrapper(SetLogin);
export const SponsorIcon = withWrapper(Sponsor);
export const UnionIcon = withWrapper(Union);
export const UploadFileIcon = withWrapper(UploadFile);
export const UserInforIcon = withWrapper(UserInfor);
export const UserRuleIcon = withWrapper(UserRule);
export const VersionIcon = withWrapper(Version);
export const ContactcsIcon = withWrapper(Contactcs);
export const DownloadAppIcon = withWrapper(DownloadApp);
export const DiamondClubIcon = withWrapper(DiamondClub);
export const FriendIcon = withWrapper(Friend);
export const KingClubIcon = withWrapper(KingClub);
export const NewsIcon = withWrapper(News);
export const TransferIcon = withWrapper(Transfer);
export const RecordesIcon = withWrapper(Recordes);
export const WithdrawalIcon = withWrapper(Withdrawal);
export const UserLoginIcon = withWrapper(UserLogin);
export const UserGuestIcon = withWrapper(UserGuest);
export const DepositVerifyIcon = withWrapper(DepositVerify);
export const NoRecordIcon = withWrapper(NoRecord);
export const HandPointerLeftIcon = withWrapper(HandPointerLeft);
export const LikeIcon = withWrapper(Like);
export const CtcIcon = withWrapper(Ctc);
export const LBIcon = withWrapper(LB);
export const RestrictIcon = withWrapper(Restrict);
export const OtpPhoneIcon = withWrapper(OtpPhone);
export const OtpMailIcon = withWrapper(OtpMail);
export const OtpCstIcon = withWrapper(OtpCst);
export const KycGuideIcon = withWrapper(KycGuide);
export const NoDataIcon = withWrapper(NoData);
export const KycApprovedIcon = withWrapper(KycApproved);
export const KycPendingIcon = withWrapper(KycPending);
export const KycRejectedIcon = withWrapper(KycRejected);
export const KycVerifyingIcon = withWrapper(KycVerifying);
export const CsIcon = withWrapper(Cs);
export const LevelIdIcon = withWrapper(LevelId);
export const LevelPhoneIcon = withWrapper(LevelPhone);
export const LevelMailIcon = withWrapper(LevelMail);
export const Usdt7Icon = withWrapper(Usdt7);
export const Usdt8Icon = withWrapper(Usdt8);
export const Usdt9Icon = withWrapper(Usdt9);
export const VerificationPhoneIcon = withWrapper(VerificationPhone);
export const VerificationVoiceIcon = withWrapper(VerificationVoice);
export const VerificationZalaIcon = withWrapper(VerificationZala);
export const VerificationMailIcon = withWrapper(VerificationMail);
export const RafMailIcon = withWrapper(RafMail);
export const RafPhoneIcon = withWrapper(RafPhone);
export const RafTurnoverIcon = withWrapper(RafTurnover);
export const RafDepositCnIcon = withWrapper(RafDepositCn);
export const RafDepositThIcon = withWrapper(RafDepositTh);
export const RafDepositVnIcon = withWrapper(RafDepositVn);
export const RafUserIcon = withWrapper(RafUser);





export const DepositIcon = props => {
    const { ...rest } = props;
    const WrappedComponent = window.LANGUAGE === "CN" ? withWrapper(DepositCn) :
        window.LANGUAGE === "TH" ? withWrapper(DepositTh) :
            withWrapper(DepositVn);
    return <WrappedComponent {...rest} />;
};











const AnimatedArrowLine = props => {
    let { direction = "right", ...rest } = props;
    const rotationMap = {
        left: "180deg", // 旋转180度变向左
        right: "0deg",   // 不旋转，保持向右（SVG默认方向）
        top: "-90deg",   // 向上旋转90度
        bottom: "90deg", // 向下旋转90度
    };

    const rotationAnim = React.useRef(new Animated.Value(direction === "top" ? 1 : 0)).current;
    const prevDirection = React.useRef(direction);

    React.useEffect(() => {
        if (prevDirection.current !== direction) {
            if (direction === "top" || direction === "bottom") {
                Animated.timing(rotationAnim, {
                    toValue: direction === "top" ? 1 : 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            }
            prevDirection.current = direction;
        }
    }, [direction]);

    const rotation = direction === "left" || direction === "right"
        ? rotationMap[direction] // 左右方向使用静态旋转
        : rotationAnim.interpolate({ // 上下方向使用动画旋转
            inputRange: [0, 1],
            outputRange: ["90deg", "-90deg"]
        });

    return (
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <ArrowLine {...rest} />
        </Animated.View>
    );
};

export const ArrowLineIcon = withWrapper(AnimatedArrowLine);













export const MoreIcon = withWrapper(More);
export const SbSettingIcon = withWrapper(SbSetting);


export const SuccessIcon = props => {
    const { type = "fill", ...rest } = props;
    const WrappedComponent = type == "fill" ? withWrapper(SuccessFill) : withWrapper(SuccessRing);
    return <WrappedComponent {...rest} />;
};


export const FailIcon = props => {
    const { type = "fill", ...rest } = props;
    const WrappedComponent = type == "fill" ? withWrapper(FailFill) : withWrapper(FailRing);
    return <WrappedComponent {...rest} />;
};


const AnimatedWarning = (Component) => props => {
    let { direction = "top", ...rest } = props;
    const rotationMap = {
        top: "0deg",
        bottom: "180deg",
    };

    const rotation = rotationMap[direction];

    return (
        <View style={{ transform: [{ rotate: rotation }] }}>
            <Component {...rest} />
        </View>
    );
};

export const WarningIcon = props => {
    const { type = "fill", direction = "top", ...rest } = props;
    const WrappedComponent = type == "fill" ? withWrapper(AnimatedWarning(WarningFill)) : withWrapper(AnimatedWarning(WarningRing));
    return <WrappedComponent direction={direction} {...rest} />;
};


export const PasswordEye = props => {
    const { type = false, onPress = () => {}, ...rest } = props;
    const WrappedComponent = type ? withWrapper(EyeShow) : withWrapper(EyeHide);
    return (
        <WrappedComponent
            onPress={() => {
                onPress(!type);
            }}
            {...rest} />
    );
};



export const AddIcon = props => {
    const { type = "fill", ...rest } = props;
    const WrappedComponent = type == "fill" ? withWrapper(AddFill) : withWrapper(AddRing);
    return <WrappedComponent {...rest} />;
};

export const LogoIcon = props => {
    const { ...rest } = props;
    const WrappedComponent = window.LANGUAGE === "CN" ? withWrapper(LogoM1) : withWrapper(LogoM23);
    return <WrappedComponent {...rest} />;
};

