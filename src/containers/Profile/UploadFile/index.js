import React from "react";
import { Image, Text, View, ScrollView } from "react-native";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
import { connect } from "react-redux";

import { translate } from "@/locales/translate";
import Color from "$Components/Color";
import FilledButton from "$Components/FilledButton";
import { ClearIcon, InforIcon, DeleteIcon, KycGuideIcon } from "$Components/icons/index.js";
import LoadingBone from "$Components/LoadingBone";
import NoRecord from "$Components/NoRecord";
import { Toasts } from "$Toasts";

import { UploadfileName, UploadFileStatusData2, KycStatusTranslation, UploadfileGuideName, getSumsubColors } from "./data";
import Styles from "./Styles";
import { RowCenterBetween, RowCenterCenter, ColumnCenterCenter, ColumnCenterStart } from "$Components/CustomView";
import actions from "$LIB/redux/actions/index";
import { LiveChatOpenGlobe } from "$Utils";
import Sumsub from "central-kyc-sumsub/SumsubNative";
import { GetGlobalModal } from "$Utils/globalModal";
import ImgMap from "$locales/Images";
import CustomLinkText from "$Components/CustomLinkText";
import LiveChat from "$Components/LiveChat";
import { LiveChatPagePiwik } from "@/actions/PiwikEventData";

class UploadFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageRestriction: "",
            documents: [],
            loading: false,
            memberKYCToggle: false,
            kycToggleFetched: false,
            identityCardStatus: false,
            sumsubLink: "",
            uploadsByDocType: {
                5: [], // for bank
                4: [], // for saving
            },
            reuploadModeByDocType: {}, // e.g., { 4: true, 5: false }
        };
    }

    componentDidMount() {
        this.getKycToggleStatus();
        this.getMemberDocuments();
        this.checkNameVerifyState();
        this.props.navigation.setParams({
            rightButton: () => {
                return (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <KycGuideIcon
                            onPress={() => {
                                Actions.UploadFileGuide();
                            }}
                            style={{ marginRight: 8 }}
                        />

                        <LiveChat
                            wrapStyle={{ marginRight: 10 }}
                            callBack={() => {
                                LiveChatPagePiwik();
                            }}
                        />
                    </View>
                );
            }
        });
    }

    checkNameVerifyState = () => {
        const currentFirstName = this.props.userInfo?.memberInfo?.firstName;
        if (currentFirstName) {
            const identityCardStatus = Boolean(currentFirstName);
            this.setState({ identityCardStatus });
        }
    };


    getKycToggleStatus = () => {
        fetchRequest(ApiPort.MemberKYCToggle, "GET")
            .then(res => {
                if (res.isSuccess) {
                    let data = res.result;
                    this.setState({
                        memberKYCToggle: data,
                        kycToggleFetched: true,
                    });
                } else {
                    this.setState({
                        kycToggleFetched: true,
                    });
                }
            })
            .catch(err => {
                console.log("KYC Toggle Error:", err);
                this.setState({ kycToggleFetched: true });
            });
    };

    triggerSumsubVerification = async () => {
        const { userInfo } = this.props;
        const newKycStatus = userInfo?.memberInfo?.newKycStatus;

        // 一點就顯示 Loading
        Toasts.loading(translate("加载中,请稍候..."), 10000);

        // 當舊 KYC 狀態為 No/Rejected，需要先打開 MemberKycVerification
        if (newKycStatus === "No" || newKycStatus === "Rejected") {
            await this.getKycVerificationLink();
        }

        // Language mapping for Sumsub
        const sumsubLangMap = {
            CN: "zh",
            TH: "th",
            VN: "vi",
        };

        return new Promise((resolve, reject) => {
            fetchRequest(ApiPort.SumsubToken, "POST", {
                type: "memberKYC",
            })
                .then(res => {
                    if (res?.isSuccess && res?.result?.token) {
                        Sumsub(
                            {
                                token: res.result.token,
                                lang: sumsubLangMap[window.LANGUAGE] || "zh",
                                theme: "light",
                                styleColor: getSumsubColors(),
                            },
                            () => Promise.resolve(res.result.token),
                            ({ status }) => {
                                // if (status === "Failed") {
                                //     Toasts.fail(translate("验证失败，请重试"));
                                // }
                                this.props.userInfo_updateMemberInfo();
                                Toasts.removeAll();
                                resolve();
                            }
                        );
                    } else {
                        // token 取得失敗
                        Toasts.removeAll();
                        Toasts.fail(translate("请求失败，请稍后重试"), 3);
                        resolve(false);
                    }
                })
                .catch(err => {
                    console.log("error", err);
                    GetGlobalModal({
                        title: translate("系統异常"),
                        message: translate("该服务暂时不可用，请稍后再试。"),
                        confirmText: translate("晚点再尝试"),
                        onConfirm: () => {},
                        cancelText: translate("联系在线客服5"),
                        onCancel: () => { LiveChatOpenGlobe(); },
                    });
                    Toasts.removeAll();
                    resolve(false);
                });
        });
    };


    getKycVerificationLink = async () => {
        try {
            const res = await fetchRequest(ApiPort.MemberKycVerification + "remarks=Self-Initiate&", "GET");
            if (res?.isSuccess) {
                this.props.userInfo_updateMemberInfo();
                return true;
            } else {
                // 顯示後端錯誤訊息
                Toasts.removeAll();
                Toasts.fail(translate("网络错误，请重试"), 3);
            }
            return false;
        } catch (err) {
            Toasts.removeAll();
            Toasts.fail(translate("网络错误，请重试"), 3);
            console.log("KYC Link error:", err);
            throw err;
        }
    };


    getMemberDocuments() {
        Toasts.loading(translate("加载中,请稍候..."), 2000);
        fetchRequest(ApiPort.MemberDocuments, "GET")
            .then(res => {
                //res = {"result":{"imageRestriction":{"extension":[".jpg",".jpeg",".png"],"size":"7MB"},"documents":[{"docTypeId":1,"docType":"Proof of Identification","docStatusId":1,"docStatus":"Pending","remainingUploadTries":2,"attachmentFront":"19580","attachmentFrontFileName":"1F633645-3EB0-4567-9E9D-947530CE81F5.png","attachmentBack":"19581","attachmentBackFileName":"1DF9A4E8-D057-47C5-A9BB-F2A0EC2AC85A.png","docToUpload":[]},{"docTypeId":2,"docType":"Proof of Address","docStatusId":0,"docStatus":"NoAttachment","remainingUploadTries":3,"docToUpload":[{"name":"FrontID","imageUrl":"http://media.stagingp3.fun88.biz/Assets/Images/KYC/NoDocument.png","imageType":"Front"}]},{"docTypeId":4,"docType":"Proof of Deposit","docStatusId":3,"docStatus":"Reject","remainingUploadTries":1,"attachmentFront":"19624","attachmentFrontFileName":"03166AF0-360B-435D-81A9-5C7DE3F2F74A.png","docToUpload":[]},{"docTypeId":5,"docType":"Proof of Bank Account Owner","docStatusId":3,"docStatus":"Reject","remainingUploadTries":1,"attachmentFront":"19625","attachmentFrontFileName":"75A177D7-3F87-4708-969C-EF7719094217.jpg","docToUpload":[]}]},"isSuccess":true}
                Toasts.removeAll();
                if (res.isSuccess) {
                    let data = res.result;
                    let documents = data.documents;
                    let imageRestriction = data.imageRestriction;
                    this.setState({
                        imageRestriction,
                        documents,
                        loading: false,
                        // Reset reupload mode when documents are updated
                        reuploadModeByDocType: {},
                    });
                }
            })
            .catch(err => {
                Toasts.removeAll();
                Toasts.fail(translate("网络错误，请重试"), 3);
                this.setState({
                    loading: false,
                });
            });
    }

    handleUploadFileSelect = (docTypeId, index, data) => {
        const { imageRestriction, uploadsByDocType } = this.state;
        const { fileName = "", fileSize, base64 = "" } = data;

        const uploads = [...(uploadsByDocType[docTypeId] || [])];

        if (!imageRestriction) {
            // Toasts.fail(translate("档名错误"), 2);
            return;
        }

        if (!fileName) {
            uploads[index] = { ...uploads[index], errString: translate("档名错误") };
            Toasts.fail(translate("档名错误"), 2);
        } else {
            let extension = imageRestriction.extension?.map(v => v.toLocaleLowerCase()) || [];
            let size = parseInt(imageRestriction.size);
            let fileNameArr = fileName.split(".");
            let imgType = fileNameArr[fileNameArr.length - 1].toLocaleLowerCase();
            let extensionFlag = Boolean(extension.find(v => v.includes(imgType)));

            if (!extensionFlag) {
                uploads[index] = { ...uploads[index], errString: translate("此文件不支持上传。仅能使用 .jpg, .jpeg 及 .png") };
                Toasts.fail(translate("此文件不支持上传。仅能使用 .jpg, .jpeg 及 .png"), 2);
            } else if (fileSize > size * 1000 * 1000) {
                uploads[index] = { ...uploads[index], errString: translate("此文件太大。请小于{x}", { x: imageRestriction.size }) };
                Toasts.fail(translate("此文件太大。请小于{x}", { x: imageRestriction.size }), 2);
            } else {
                uploads[index] = { filename: fileName, fileBytes: base64, fileSize, errString: "" };
            }
        }

        this.setState({
            uploadsByDocType: {
                ...uploadsByDocType,
                [docTypeId]: uploads,
            },
        });
    };

    handleUploadClear = (docTypeId, index) => {
        const { uploadsByDocType } = this.state;
        const uploads = [...(uploadsByDocType[docTypeId] || [])];
        uploads[index] = { filename: "", fileBytes: "", errString: "" };

        // Also clear the imageError state for this index
        this.setState({
            uploadsByDocType: {
                ...uploadsByDocType,
                [docTypeId]: uploads,
            },
            [`imageError${index}`]: false,
        });
        Toasts.success(translate("文件已移除"), 200);
    };

    postVerification(docTypeId, remainingUploadTries, doc) {
        const { uploadsByDocType } = this.state;
        const uploads = uploadsByDocType[docTypeId] || [];
        const params = uploads
            .filter(v => v.filename && v.fileBytes)
            .map((v, i) => ({
                imageType: doc.docToUpload?.[i]?.imageType || "Default",
                filename: v.filename,
                byteAttachment: v.fileBytes,
            }));

        // Show loading toast with long duration - it will be removed when request completes
        Toasts.loading(translate("加载中,请稍候..."), 2000000);

        fetchRequest(ApiPort.PostVerification + "docTypeId=" + docTypeId + "&numberOfTry=" + remainingUploadTries + "&", "POST", params)
            .then(res => {
                Toasts.removeAll();
                let { isSuccess = false, result = false } = res;
                console.log("RESSSS", JSON.stringify(res, null, 2));
                if (isSuccess) {
                    Toasts.success(translate("文档已上传"), 3000);
                    this.getMemberDocuments();
                } else {
                    // Toasts.fail(res?.errors[0]?.message || "");
                    GetGlobalModal({
                        iconName: "warning",
                        title: translate("温馨提醒3"),
                        message: translate("提交失败由于未知的错误，请稍后再试"),
                        confirmText: translate("移除文件3"),
                        onConfirm: () => {
                            const { uploadsByDocType } = this.state;
                            const uploads = uploadsByDocType[docTypeId] || [];
                            uploads.forEach((_, index) => {
                                this.handleUploadClear(docTypeId, index);
                            });
                        }
                    });
                }
            })
            .catch(err => {
                Toasts.removeAll();
                // Toasts.fail(err?.errors[0]?.message || "");
            });
    }

    // MB (1000) not MiB (1024)
    formatFileSize = (fileSize = 0) => {
        const kb = fileSize / 1000;
        if (kb < 1000) {
            return `${Math.ceil(kb)}KB`;
        } else {
            const mb = fileSize / (1000 * 1000);
            return `${mb.toFixed(2)}MB`;
        }
    };

    UploadSection = ({ doc, uploads, onClear, onSelect, pageTitle }) => {
        const { imageRestriction } = this.state;

        const remainingTries = doc.remainingUploadTries;
        const docStatus = doc?.docStatus?.toLowerCase();
        const uploadStatus = ["pending", "approve", "reject"].includes(docStatus);
        const { description, icon: KycStatusIcon } = UploadFileStatusData2[docStatus] || {};

        const forceUploadMode = this.state.reuploadModeByDocType?.[doc.docTypeId] ?? false;
        if (uploadStatus && !forceUploadMode) {
            return (
                <View style={[Styles.uploadBox2, { paddingHorizontal: 20, marginBottom: 12 }]}>
                    <ColumnCenterCenter>
                        <Text style={[Styles.verificationTitle, { flex: 1, textAlign: "center" }]}>{UploadfileName[`type${doc.docTypeId}`]}</Text>
                        {
                            Boolean(KycStatusIcon) &&
                            <KycStatusIcon wrapStyle={{ marginBottom: 4 }} />
                        }

                        {remainingTries === 0 && docStatus === "reject" ? (
                            <>
                                <Text style={[Styles.verificationText]}>{translate("您最多只能提交文件 3 次，请联系客服")}</Text>
                                <FilledButton
                                    text={translate("联系在线客服2")}
                                    onPress={() => {
                                        LiveChatOpenGlobe();
                                    }}
                                    wrapStyle={{ marginTop: 24 }}
                                />
                            </>
                        ) : (
                            <Text style={[Styles.verificationText]}>{description}</Text>
                        )}

                        {remainingTries > 0 && docStatus === "reject" && (
                            <>
                                <FilledButton
                                    text={translate("重新上传")}
                                    onPress={() => {
                                        this.setState(prevState => {
                                            const newState = {
                                                reuploadModeByDocType: {
                                                    ...prevState.reuploadModeByDocType,
                                                    [doc.docTypeId]: true,
                                                },
                                                uploadsByDocType: {
                                                    ...prevState.uploadsByDocType,
                                                    [doc.docTypeId]: doc.docTypeId === 1
                                                        ? [{ filename: "", fileBytes: "", errString: "" }, { filename: "", fileBytes: "", errString: "" }]
                                                        : [{ filename: "", fileBytes: "", errString: "" }],
                                                }
                                            };
                                            return newState;
                                        });
                                    }}
                                    wrapStyle={{
                                        backgroundColor: Color.vibrantGreen,
                                        marginTop: 24,
                                    }}
                                />

                                <CustomLinkText
                                    textAlign="center"
                                    text={translate("您还有 ({{X}}) 次尝试机会", {
                                        X: remainingTries,
                                    })}
                                />
                            </>

                        )}
                    </ColumnCenterCenter>

                </View>
            );
        }

        return (
            <View style={{ marginBottom: 12 }}>
                <View style={Styles.uploadBox2}>
                    {/* Create upload items based on document type when docToUpload is empty */}
                    {(doc.docToUpload.length > 0 ? doc.docToUpload : [{ name: "Default", imageType: "Default" }]).map((imgItem, index) => {
                        const upload = uploads?.[index] || {};
                        const flag = !!upload.filename;
                        const isVn = window.LANGUAGE == "VN";
                        const isCN = window.LANGUAGE == "CN";
                        const isTH = window.LANGUAGE == "TH";

                        return (
                            <View key={index} style={{ paddingHorizontal: 20 }}>
                                <RowCenterCenter style={Styles.uploadList}>
                                    <Text style={[
                                        Styles.verificationTitle,
                                        { position: "absolute", left: 0, right: 0, textAlign: "center" },
                                        isVn && { fontSize: 11 },
                                        isTH && { fontSize: 14 }
                                    ]}>
                                        {UploadfileName[`type${doc.docTypeId}`]}
                                    </Text>
                                    {index === 0 && (
                                        <Touch onPress={() => {
                                            Actions.UploadExample({
                                                pageTitle,
                                                docTypeId: doc.docTypeId * 1,
                                            });
                                        }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", position: "absolute", right: 0 }}>
                                            {isCN && <InforIcon width={16} height={16} fill={Color.theme} wrapStyle={{ marginRight: 2 }} />}
                                            <Text
                                                style={[
                                                    Styles.guideText,
                                                    isVn && { fontSize: 9 }
                                                ]}>
                                                {translate("查看示例")}
                                            </Text>
                                        </Touch>
                                    )}
                                </RowCenterCenter>

                                {
                                    flag ? (
                                        <RowCenterBetween>
                                            {this.state[`imageError${index}`] ? (
                                                <RowCenterBetween style={Styles.uploadFileBtn2}>
                                                    <View style={{ flex: 1, marginRight: 10 }}>
                                                        <Text
                                                            style={[
                                                                Styles.filenameText,
                                                                { textAlign: "left" },
                                                            ]}
                                                            numberOfLines={1}
                                                            ellipsizeMode="middle"
                                                        >
                                                            {this.state[`filename${index}`] || upload.filename}
                                                        </Text>
                                                        <Text style={{ color: "#999", fontSize: 12, marginTop: 2 }}>
                                                            {this.formatFileSize(upload.fileSize || 0)}
                                                        </Text>
                                                    </View>
                                                    <ClearIcon
                                                        onPress={() => {
                                                            GetGlobalModal({
                                                                title: translate("移除文件"),
                                                                message: translate("您是否确定要移除这个文件?"),
                                                                cancelText: translate("取消"),
                                                                onCancel: () => {},
                                                                confirmText: translate("确定"),
                                                                onConfirm: () => {
                                                                    onClear?.(index);
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </RowCenterBetween>
                                            ) : (
                                                <View style={{ flex: 1 }}>
                                                    <Image
                                                        source={{ uri: `data:image/*;base64,${upload.fileBytes}` }}
                                                        // source={{ uri: "data:image/*;base64,this-will-fail" }}
                                                        resizeMode="cover"
                                                        style={{ width: "100%", height: 150 }}
                                                        onError={() => {
                                                            this.setState({ [`imageError${index}`]: true });
                                                        }}
                                                    />

                                                    <Touch
                                                        style={Styles.deleteButton}
                                                        onPress={() => {
                                                            GetGlobalModal({
                                                                title: translate("移除文件"),
                                                                message: translate("您是否确定要移除这个文件?"),
                                                                cancelText: translate("保留"),
                                                                onCancel: () => {},
                                                                confirmText: translate("移除文件2"),
                                                                onConfirm: () => {
                                                                    onClear?.(index);
                                                                },
                                                            });
                                                        }}
                                                    >
                                                        <DeleteIcon
                                                            fill={"red"}
                                                            width={25}
                                                            height={25}
                                                        />
                                                    </Touch>
                                                </View>
                                            )}
                                        </RowCenterBetween>
                                    ) : (
                                        <ColumnCenterStart
                                            onPress={() => {
                                                GetGlobalModal({
                                                    name: "UploadModal",
                                                    position: "bottom",
                                                    allowMask: true,
                                                    wrapStyle: { width: "96%" },
                                                    modalCallBack: data => onSelect?.(index, data),
                                                });
                                            }}
                                        >
                                            <Image resizeMode="contain" source={ImgMap.uploadFile} style={[{ width: "100%", height: 120 }]} />
                                        </ColumnCenterStart>
                                    )
                                }

                                <CustomLinkText
                                    wrapStyle={{
                                        marginTop: 15,
                                    }}
                                    norMaltextStyle={[Styles.tipText, { fontWeight: "400" }]}
                                    themeTextStyle={[Styles.tipText, { fontWeight: "400" }]}
                                    // text={translate("仅支持{{x}}文件。每个文件不超于{{y}}", { x: imgExtension, y: imgSize })}
                                    text={translate("仅支持 .jpg, .jpeg 和 .png 文件。每个文件不超于 7MB")}
                                />

                                <FilledButton
                                    text={translate("提交1")}
                                    enable={uploads.some(u => u.filename && u.fileBytes)}
                                    wrapStyle={{ marginTop: 15 }}
                                    onPress={() => {
                                        this.postVerification(doc.docTypeId, remainingTries, doc);
                                    }} />

                                <CustomLinkText
                                    textAlign="center"
                                    wrapStyle={{ marginTop: 12 }}
                                    text={translate("您还有 ({{X}}) 次尝试机会", {
                                        X: remainingTries,
                                    })}
                                />
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };


    render() {
        const { documents, loading, memberKYCToggle, identityCardStatus, kycToggleFetched } = this.state;
        const newKycStatus = this.props.userInfo?.memberInfo?.newKycStatus;
        const kycStatusTranslation = KycStatusTranslation[newKycStatus];
        const KycStatusIcon = kycStatusTranslation?.icon;

        const bankDoc = documents.find(v => v.docTypeId === 5);
        const savingDoc = documents.find(v => v.docTypeId === 4);


        if (!kycToggleFetched || loading) {
            return <View style={Styles.viewContainer2}><LoadingBone height={60} /></View>;
        }

        if (!memberKYCToggle && !documents.length) {
            return (
                <View style={Styles.viewContainer2}>
                    <NoRecord
                        text={translate("您的账户目前无需进行文件验证")}
                        imgName="noData"
                        width={90}
                        height={90}
                    />
                </View>
            );
        }

        return (
            <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <View style={Styles.viewContainer2}>
                    <View>
                        {memberKYCToggle && <ColumnCenterCenter style={Styles.verificationBox}>
                            <Text style={Styles.verificationTitle}>{kycStatusTranslation?.title}</Text>
                            {
                                Boolean(KycStatusIcon) &&
                                <KycStatusIcon wrapStyle={{ marginBottom: 4 }} />
                            }
                            <Text style={[Styles.verificationText]}>{kycStatusTranslation?.description}</Text>
                            {kycStatusTranslation?.button && <FilledButton
                                onPress={() => {
                                    if (identityCardStatus) {
                                        this.triggerSumsubVerification();
                                    } else {
                                        Actions.UserUpdateInfo({
                                            updateType: "firstName",
                                            fromUploadFile: true,
                                            onSuccess: async () => {
                                                // Run Sumsub directly in this screen after name submission
                                                await this.triggerSumsubVerification();
                                                // Navigate back to previous screen after Sumsub completion
                                                Actions.pop();
                                            },
                                        });
                                    }
                                }}
                                text={kycStatusTranslation?.button}
                                wrapStyle={{ marginTop: 24 }}
                            />}
                        </ColumnCenterCenter>}
                        {(bankDoc || savingDoc) && <View style={{ marginTop: 12 }}>
                            {[bankDoc, savingDoc].map(doc => doc && (
                                <this.UploadSection
                                    key={doc.docTypeId}
                                    doc={doc}
                                    uploads={this.state.uploadsByDocType[doc.docTypeId] || []}
                                    onClear={(index) => this.handleUploadClear(doc.docTypeId, index)}
                                    onSelect={(index, data) => this.handleUploadFileSelect(doc.docTypeId, index, data)}
                                    pageTitle={UploadfileGuideName[`type${doc.docTypeId}`]}
                                />
                            ))}
                        </View>}
                    </View>

                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
    maintainStatus: state.maintainStatus,
    userSetting: state.userSetting,
});

const mapDispatchToProps = dispatch => ({
    userInfo_updateMemberInfo: data => dispatch(actions.ACTION_UserInfo_updateMemberInfo(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);
