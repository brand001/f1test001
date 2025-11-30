import moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import ModalDropdown from "react-native-modal-dropdown";
import { FormatDate } from "$Utils";
import { Modal } from "@ant-design/react-native";
import { connect } from "react-redux";
import { CloseIcon, ArrowIcon, DurationIcon, CalendarIcon } from "./icons/index";
import FilledButton from "./FilledButton";
import actions from "@/lib/redux/actions/index";
import { translate } from "@/locales/translate";
import Color from "./Color";
import { ColumnCenterCenter, ColumnCenterStart, RowCenterBetween, RowCenterCenter, RowCenterStart } from "./CustomView";
import { MAX_DATE_INTERVAL_DAYS, MAX_DATE_RANGE_DURATION_DAYS } from "@/lib/constants";

const { width } = Dimensions.get("window");

// 常量配置
const DEFAULT_DATE_RANGE_DAYS = 6; // 默认7天范围（包含今天，所以是6天前）
const CUSTOM_DATE_OPTION_INDEX = 3;
const MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
// 日期选项配置
const modalDropdownDateRangeOptions = [
    {
        get text() {
            return translate("今天");
        },
        piwik: "Betrecord_today",
        value: 0,
        days: 0
    },
    {
        get text() {
            return translate("近7天");
        },
        piwik: "Betrecord_yesterday",
        value: 1,
        days: 6
    },
    {
        get text() {
            return translate("近30天");
        },
        piwik: "Betrecord_7days",
        value: 2,
        days: 29
    },
    {
        get text() {
            return translate("自定义");
        },
        piwik: "Betrecord_daterange",
        value: 3,
        days: null
    },
];


const buttonGroupDateRangeOptions = [
    {
        get text() {
            return translate("今天");
        },
        piwik: "Betrecord_today",
        value: 0,
        days: 0
    },
    {
        get text() {
            return translate("昨天");
        },
        piwik: "Betrecord_yesterday",
        value: 1,
        days: 1,
        isSingleDay: true // 标记为单日选项
    },
    {
        get text() {
            return translate("近7天");
        },
        piwik: "Betrecord_7days",
        value: 2,
        days: 7
    },
    {
        get text() {
            return translate("日期");
        },
        piwik: "Betrecord_daterange",
        value: 3,
        days: null
    },
];

// 星期配置
const WEEKDAYS_BY_LANGUAGE = {
    CN: ["日", "一", "二", "三", "四", "五", "六"],
    TH: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
    VN: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
};

class BettingCalendar extends React.Component {
    constructor(props) {
        super(props);
        const dateRangeOptions = props?.type === "modalDropdown" ? modalDropdownDateRangeOptions : buttonGroupDateRangeOptions;
        const defaultSelectedIndex = props.defaultSelectedIndex !== undefined ? props.defaultSelectedIndex : 0;
        this.state = {
            selectedDateRangeIndex: defaultSelectedIndex,
            previousSelectedDateRangeIndex: defaultSelectedIndex, // 保存打开自定义 modal 之前的选择索引
            dateRange: [new Date(), new Date()],
            isDatePickerModalVisible: false,
            confirmedStartDate: props.startDate ? moment(props.startDate).format() : moment().subtract(1, "day"),
            confirmedEndDate: props.endDate ? moment(props.endDate).format() : "",
            draftStartDate: "",
            draftEndDate: "",
            minDate: moment().subtract(props.maxInterval || MAX_DATE_INTERVAL_DAYS, "day"),
            maxDate: moment(),
            hasConfirmedDateRange: true,
            maxRangeDuration: props.maxRangeDuration || MAX_DATE_RANGE_DURATION_DAYS,
            isSelectingStartDate: true,
            isSelectingEndDate: false,
            currentMonth: new Date(),
            isDropdownVisible: false,
            type: props?.type || "modalDropdown",
            dateRangeOptions: dateRangeOptions,
            showInforText: props?.showInforText,
        };
        this.onCalendarDateChange = this.onCalendarDateChange.bind(this);
    }

    componentDidMount() {
        // 如果设置了 defaultSelectedIndex，在组件挂载时应用对应的日期范围
        const { defaultSelectedIndex } = this.props;
        if (defaultSelectedIndex !== undefined && defaultSelectedIndex !== null) {
            this.onApplyDateRangeSelection(defaultSelectedIndex);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { startDate, endDate, maxRangeDuration } = this.props;
        if (startDate !== prevProps.startDate || endDate !== prevProps.endDate) {
            this.setState({
                confirmedStartDate: startDate ? moment(startDate).format() : this.state.confirmedStartDate,
                confirmedEndDate: endDate ? moment(endDate).format() : this.state.confirmedEndDate
            });
        }

        // 如果 maxRangeDuration prop 变化，更新 state
        if (maxRangeDuration !== prevProps.maxRangeDuration) {
            this.setState({
                maxRangeDuration: maxRangeDuration || null
            });
        }

        // 当模态框打开时，设置默认日期范围并匹配月份
        if (this.state.isDatePickerModalVisible && !prevState.isDatePickerModalVisible) {
            const { draftStartDate, draftEndDate, confirmedStartDate } = this.state;
            const targetDate = draftStartDate || confirmedStartDate;

            // 如果有已选择的日期，设置月份为该日期所在月份
            if (targetDate) {
                const targetDateMoment = moment(targetDate);
                this.setState({
                    currentMonth: targetDateMoment.toDate(),
                });
            }

            // 如果没有草稿日期，设置默认日期范围
            if (!draftStartDate || !draftEndDate) {
                const { startDate: defaultStartDate, endDate: defaultEndDate } = this.onGetDefaultDateRange();
                this.setState({
                    draftStartDate: defaultStartDate.format(),
                    draftEndDate: defaultEndDate.format(),
                });
            }
        }
    }

    // 检查日期范围是否超过限制
    onCheckDateRangeLimit = (startDateMoment, endDateMoment) => {
        const { maxRangeDuration } = this.state;
        if (!maxRangeDuration) return true;

        const daysDifference = endDateMoment.diff(startDateMoment, "days");
        const totalDaysIncludingBoth = daysDifference + 1; // 包含开始和结束日期
        return totalDaysIncludingBoth <= parseInt(maxRangeDuration);
    };

    // 获取默认日期范围（7天）
    onGetDefaultDateRange = () => {
        const endDate = moment().endOf("day");
        const startDate = moment().subtract(DEFAULT_DATE_RANGE_DAYS, "days").startOf("day");
        return { startDate, endDate };
    };

    // 处理日历日期选择变更
    onCalendarDateChange = (selectedDate, dateSelectionType) => {
        if (!selectedDate) return;

        const updatedState = {};
        const { draftStartDate } = this.state;

        if (dateSelectionType === "END_DATE") {
            const startDateMoment = moment(draftStartDate);
            const endDateMoment = moment(selectedDate);

            if (endDateMoment.isSameOrAfter(startDateMoment) &&
                this.onCheckDateRangeLimit(startDateMoment, endDateMoment)) {
                updatedState.draftEndDate = selectedDate;
                updatedState.isSelectingEndDate = true;
                updatedState.isSelectingStartDate = false;
            }
        } else {
            // 处理开始日期选择
            updatedState.draftStartDate = selectedDate;
            updatedState.draftEndDate = selectedDate; // 重置结束日期
            updatedState.isSelectingStartDate = true;
            updatedState.isSelectingEndDate = false;
        }

        if (Object.keys(updatedState).length > 0) {
            this.setState(updatedState);
        }
    };

    // 获取日历组件需要的开始日期格式
    onGetCalendarStartDate = () => {
        const { draftStartDate } = this.state;
        if (draftStartDate) {
            return moment(draftStartDate).format();
        }
        return null;
    };

    // 获取日历组件需要的结束日期格式
    onGetCalendarEndDate = () => {
        const { draftStartDate, draftEndDate } = this.state;
        if (draftEndDate && draftStartDate !== draftEndDate) {
            return moment(draftEndDate).format();
        }
        return null;
    };

    // 计算已选择的天数
    onCalculateSelectedDaysCount = () => {
        const { draftStartDate, draftEndDate } = this.state;

        if (!draftStartDate || !draftEndDate) return 1;

        const startDateMoment = moment(draftStartDate);
        const endDateMoment = moment(draftEndDate);
        return endDateMoment.diff(startDateMoment, "days") + 1;
    };

    // 重置到默认日期范围
    onResetToDefaultDateRange = () => {
        const { startDate: defaultStartDate, endDate: defaultEndDate } = this.onGetDefaultDateRange();
        this.setState({
            draftStartDate: defaultStartDate.format(),
            draftEndDate: defaultEndDate.format(),
            isSelectingStartDate: true,
            isSelectingEndDate: false,
            hasConfirmedDateRange: true,
        });
    };

    // 根据选项索引计算日期范围
    onCalculateDateRangeByOption = (dateRangeOptionIndex) => {
        const { dateRangeOptions, draftStartDate, draftEndDate, confirmedStartDate, confirmedEndDate } = this.state;

        if (typeof dateRangeOptionIndex !== "number") {
            return Array.isArray(dateRangeOptionIndex) ? dateRangeOptionIndex : [dateRangeOptionIndex, dateRangeOptionIndex];
        }

        const selectedOption = dateRangeOptions[dateRangeOptionIndex];

        // 自定义模式：优先使用 draftStartDate 和 draftEndDate
        if (selectedOption.days === null) {
            const startDateString = draftStartDate
                ? moment(draftStartDate).format("YYYY-MM-DD")
                : (confirmedStartDate ? moment(confirmedStartDate).format("YYYY-MM-DD") : "");
            const endDateString = draftEndDate
                ? moment(draftEndDate).format("YYYY-MM-DD")
                : (confirmedEndDate ? moment(confirmedEndDate).format("YYYY-MM-DD") : "");
            return [startDateString, endDateString];
        }

        // 预设日期范围
        const todayEndDate = moment().endOf("day");
        let calculatedStartDate;

        if (selectedOption.days === 0) {
            // 今天：今天到今天
            calculatedStartDate = todayEndDate.clone();
        } else if (selectedOption.isSingleDay) {
            // 单日选项（如"昨天"）：只包含那一天
            calculatedStartDate = moment().subtract(selectedOption.days, "days").startOf("day");
            const singleDayEndDate = calculatedStartDate.clone().endOf("day");
            return [calculatedStartDate, singleDayEndDate];
        } else {
            // 多日范围：N天前到今天
            calculatedStartDate = moment().subtract(selectedOption.days, "days").startOf("day");
        }
        return [calculatedStartDate, todayEndDate];
    };

    // 应用日期范围选择并触发回调
    onApplyDateRangeSelection = (dateRangeOptionIndex) => {
        try {
            const { dateRangeOptions } = this.state;
            const calculatedDateRange = this.onCalculateDateRangeByOption(dateRangeOptionIndex);

            // 验证日期有效性
            if (!calculatedDateRange[0] || !calculatedDateRange[1] ||
                !moment(calculatedDateRange[0]).isValid() || !moment(calculatedDateRange[1]).isValid()) {
                console.warn("Invalid date range:", calculatedDateRange);
                return;
            }

            const isCustomDateRangeMode = typeof dateRangeOptionIndex === "number" &&
                dateRangeOptions[dateRangeOptionIndex].value === dateRangeOptions[dateRangeOptions.length - 1].value;

            this.setState({
                dateRange: calculatedDateRange,
                selectedDateRangeIndex: typeof dateRangeOptionIndex === "number"
                    ? dateRangeOptionIndex
                    : this.state.selectedDateRangeIndex,
                // 点击预设选项（今天、昨天、近7天）时，设置为 false，让自定义日期范围消失
                // 点击自定义日期并确认时，设置为 true，显示自定义日期范围
                hasConfirmedDateRange: isCustomDateRangeMode,
            }, () => {
                const formattedStartDate = moment(calculatedDateRange[0]).format("YYYY-MM-DD");
                const formattedEndDate = moment(calculatedDateRange[1]).format("YYYY-MM-DD");
                this.props.selectChange(formattedStartDate, formattedEndDate, isCustomDateRangeMode);
            });
        } catch (error) {
            console.warn("Error in onApplyDateRangeSelection:", error);
        }
    };

    // 处理日期选项选择
    onDateOptionSelect = (dateRangeOptionIndex) => {
        if (dateRangeOptionIndex === CUSTOM_DATE_OPTION_INDEX) {
            const { selectedDateRangeIndex, draftStartDate, draftEndDate, confirmedStartDate } = this.state;
            const isCustomDateRangeMode = selectedDateRangeIndex === CUSTOM_DATE_OPTION_INDEX &&
                draftStartDate && draftEndDate;

            const { startDate: initialStartDate, endDate: initialEndDate } = isCustomDateRangeMode
                ? { startDate: moment(draftStartDate), endDate: moment(draftEndDate) }
                : this.onGetDefaultDateRange();

            // 设置月份为已选择日期的月份（优先使用草稿日期，否则使用已确认日期）
            const targetDateForMonth = draftStartDate || confirmedStartDate;
            const targetMonth = targetDateForMonth ? moment(targetDateForMonth).toDate() : initialStartDate.toDate();

            this.setState({
                isDatePickerModalVisible: true,
                previousSelectedDateRangeIndex: selectedDateRangeIndex, // 保存当前选择，用于取消时恢复
                selectedDateRangeIndex: CUSTOM_DATE_OPTION_INDEX,
                draftStartDate: initialStartDate.format(),
                draftEndDate: initialEndDate.format(),
                currentMonth: targetMonth,
                isSelectingStartDate: true,
                isSelectingEndDate: false,
                // 打开 modal 时，保持 hasConfirmedDateRange 的当前值，不重置
                // 这样如果之前已经有确认的日期范围，时间显示不会消失
            });
            return;
        }
        this.onApplyDateRangeSelection(dateRangeOptionIndex);
    };

    // 确认日期范围选择
    onConfirmDateRangeSelection = () => {
        const { draftStartDate, draftEndDate } = this.state;
        if (!draftStartDate || !draftEndDate) {
            return;
        }

        // onApplyDateRangeSelection 内部会设置 hasConfirmedDateRange: true（因为是自定义日期）
        this.onApplyDateRangeSelection(CUSTOM_DATE_OPTION_INDEX);

        // 将草稿状态应用到已确认状态
        this.setState({
            confirmedStartDate: draftStartDate,
            confirmedEndDate: draftEndDate,
            isDatePickerModalVisible: false,
            isSelectingStartDate: true,
            isSelectingEndDate: false,
        });
    };

    // Dropdown 相关方法
    onFormatDropdownButtonText = (dropdownOption) => `${dropdownOption.text}`;

    onRenderDropdownOptionRow = (dropdownOption) => (
        <ColumnCenterStart style={styles.dropdownRow}>
            <Text style={styles.dropdownRowText}>{`${dropdownOption.text}`}</Text>
        </ColumnCenterStart>
    );

    onRenderDropdownOptionSeparator = () => <View style={styles.dropdownSeparator} />;

    onDropdownOpen = () => {
        this.setState({ isDropdownVisible: true });
    };

    onDropdownClose = () => {
        this.setState({ isDropdownVisible: false });
    };

    // 关闭日期选择器 modal 时恢复状态
    onCloseDatePickerModal = () => {
        const { hasConfirmedDateRange, previousSelectedDateRangeIndex, confirmedStartDate, confirmedEndDate } = this.state;

        // 如果没有确认过自定义日期范围，恢复到之前的选择索引和日期范围
        if (!hasConfirmedDateRange) {
            this.setState({
                isDatePickerModalVisible: false,
                selectedDateRangeIndex: previousSelectedDateRangeIndex,
                isSelectingStartDate: true,
                isSelectingEndDate: false,
            });
            // 恢复到之前选择的日期范围
            this.onApplyDateRangeSelection(previousSelectedDateRangeIndex);
            return;
        }

        // 如果已经确认过自定义日期范围，只关闭 modal，保持显示自定义日期范围
        this.setState({
            isDatePickerModalVisible: false,
            draftStartDate: confirmedStartDate || "",
            draftEndDate: confirmedEndDate || "",
            isSelectingStartDate: true,
            isSelectingEndDate: false,
        });
    };

    // 渲染日历上一个月导航箭头
    onRenderCalendarPreviousMonthArrow = () => {
        const { currentMonth, minDate } = this.state;
        const currentMonthMoment = moment(currentMonth);
        const minDateMoment = moment(minDate);
        const previousMonthMoment = currentMonthMoment.clone().subtract(1, "month");
        const canNavigateToPreviousMonth = previousMonthMoment.isAfter(minDateMoment) ||
            previousMonthMoment.isSame(minDateMoment, "month");

        return canNavigateToPreviousMonth ? (
            <ArrowIcon fill={Color.black} width={14} height={14} />
        ) : null;
    };

    // 渲染日历下一个月导航箭头
    onRenderCalendarNextMonthArrow = () => {
        const { currentMonth, maxDate } = this.state;
        const currentMonthMoment = moment(currentMonth);
        const maxDateMoment = moment(maxDate);
        const currentTime = moment();
        const nextMonthMoment = currentMonthMoment.clone().add(1, "month");
        const canNavigateToNextMonth = nextMonthMoment.isBefore(maxDateMoment) ||
            nextMonthMoment.isSame(maxDateMoment, "month");
        const isCurrentlyViewingCurrentMonth = currentMonthMoment.isSame(currentTime, "month") &&
            currentMonthMoment.isSame(currentTime, "year");

        return canNavigateToNextMonth && !isCurrentlyViewingCurrentMonth ? (
            <ArrowIcon fill={Color.black} width={14} height={14} direction="right" />
        ) : null;
    };

    render() {
        const {
            confirmedStartDate,
            confirmedEndDate,
            minDate,
            maxDate,
            hasConfirmedDateRange,
            selectedDateRangeIndex,
            currentMonth,
            isDropdownVisible,
            isDatePickerModalVisible,
            type,
            dateRangeOptions,
            maxRangeDuration,
            showInforText
        } = this.state;

        const selectedDaysCount = this.onCalculateSelectedDaysCount();

        return (
            <View>
                {/* Dropdown 部分 */}
                {type === "modalDropdown" ? (
                    <RowCenterCenter style={styles.dropdownContainer}>
                        <ModalDropdown
                            ref={el => (this.dateRangeDropdownRef = el)}
                            defaultValue={dateRangeOptions[selectedDateRangeIndex].text}
                            defaultIndex={selectedDateRangeIndex}
                            dropdownStyle={[styles.dropdown_DX_dropdown]}
                            options={dateRangeOptions}
                            renderButtonText={this.onFormatDropdownButtonText}
                            renderSeparator={this.onRenderDropdownOptionSeparator}
                            renderRow={this.onRenderDropdownOptionRow}
                            onSelect={this.onDateOptionSelect}
                            onDropdownWillShow={this.onDropdownOpen}
                            onDropdownWillHide={this.onDropdownClose}
                        >
                            <RowCenterCenter>
                                {selectedDateRangeIndex !== dateRangeOptions.length - 1 ? (
                                    <Text style={styles.textnoactive}>
                                        {dateRangeOptions[selectedDateRangeIndex].text}
                                    </Text>
                                ) : (
                                    <RowCenterCenter>
                                        {hasConfirmedDateRange ? (
                                            <>
                                                <Text style={styles.textnoactive}>
                                                    {FormatDate(moment(confirmedStartDate), { timeLevel: "onlyDate" })}
                                                </Text>
                                                <DurationIcon fill={Color.darkGray} width={16} height={16} />
                                                <Text style={styles.textnoactive}>
                                                    {FormatDate(moment(confirmedEndDate), { timeLevel: "onlyDate" })}
                                                </Text>
                                            </>
                                        ) : (
                                            <Text style={styles.textnoactive}>
                                                {dateRangeOptions[selectedDateRangeIndex].text}
                                            </Text>
                                        )}
                                    </RowCenterCenter>
                                )}
                                <ArrowIcon
                                    fill={Color.gray}
                                    width={12}
                                    height={12}
                                    direction={isDropdownVisible ? "top" : "bottom"}
                                />
                            </RowCenterCenter>
                        </ModalDropdown>
                    </RowCenterCenter>
                ) : (
                    <RowCenterStart>
                        {dateRangeOptions.map((dateRangeOption, optionIndex) => {
                            const isOptionSelected = selectedDateRangeIndex === optionIndex;
                            const isLastOption = optionIndex === dateRangeOptions.length - 1;
                            const isCustomDateRange = isLastOption && hasConfirmedDateRange;

                            return (
                                <FilledButton
                                    key={optionIndex}
                                    text={isCustomDateRange ? "" : dateRangeOption.text}
                                    onPress={() => this.onDateOptionSelect(optionIndex)}
                                    wrapStyle={[
                                        styles.dateRangeButtonWrap,
                                        {
                                            borderColor: isOptionSelected ? Color.theme : Color.gray,
                                            marginLeft: optionIndex > 0 ? 8 : 0,
                                        }
                                    ]}
                                    textStyle={[
                                        styles.dateRangeButtonText,
                                        { color: isOptionSelected ? Color.theme : Color.gray }
                                    ]}
                                    outlined={true}
                                >
                                    <>
                                        {
                                            isCustomDateRange &&
                                            <>
                                                <Text style={[
                                                    styles.customDateRangeText,
                                                    { color: isOptionSelected ? Color.theme : Color.gray }
                                                ]}>
                                                    {moment(confirmedStartDate).format("MM/DD")}
                                                </Text>
                                                <Text style={[
                                                    styles.customDateRangeText,
                                                    { color: isOptionSelected ? Color.theme : Color.gray }
                                                ]}>
                                                    至
                                                </Text>
                                                <Text style={[
                                                    styles.customDateRangeText,
                                                    { color: isOptionSelected ? Color.theme : Color.gray }
                                                ]}>
                                                    {moment(confirmedEndDate).format("MM/DD")}
                                                </Text>
                                            </>
                                        }

                                        {
                                            isLastOption &&
                                            <CalendarIcon
                                                width={16}
                                                height={16}
                                                fill={isOptionSelected ? Color.theme : Color.gray}
                                                wrapStyle={styles.customDateRangeIconWrap}
                                            />
                                        }
                                    </>

                                </FilledButton>
                            );
                        })}
                    </RowCenterStart>
                )}

                {/* 日期选择弹窗 */}
                <Modal
                    popup
                    visible={isDatePickerModalVisible}
                    maskClosable={true}
                    animationType="slide-up"
                    style={styles.modalContainer}
                    onClose={this.onCloseDatePickerModal}
                >
                    <ColumnCenterCenter style={styles.modalContent}>
                        {/* 弹窗头部 */}
                        <RowCenterBetween style={styles.modalHeader}>
                            <TouchableOpacity
                                onPress={this.onCloseDatePickerModal}
                            >
                                <CloseIcon
                                    fill={Color.gray}
                                    width={24}
                                    height={24}
                                />
                            </TouchableOpacity>

                            <Text style={styles.titleText}>{translate("选择日期1")}</Text>

                            <TouchableOpacity onPress={this.onResetToDefaultDateRange}>
                                <Text style={styles.resetText}>{translate("重置")}</Text>
                            </TouchableOpacity>
                        </RowCenterBetween>

                        {showInforText && (
                            <View style={styles.descriptionContainer}>
                                <Text style={styles.descriptionText}>
                                    {translate("可搜索 {X} 天内的记录，每次最多查看 {Y} 天的记录", { X: MAX_DATE_INTERVAL_DAYS, Y: MAX_DATE_RANGE_DURATION_DAYS })}
                                </Text>
                            </View>
                        )}

                        {/* 日期范围显示 */}
                        <View style={styles.dateRangeContainer}>
                            <Text style={styles.dateRangeText}>
                                {FormatDate(moment(this.state.draftStartDate), { timeLevel: "onlyDate" })} - {FormatDate(moment(this.state.draftEndDate), { timeLevel: "onlyDate" })}
                            </Text>
                        </View>

                        {/* 日历 */}
                        <View style={styles.calendarContainer}>
                            <CalendarPicker
                                selectedStartDate={this.onGetCalendarStartDate()}
                                selectedEndDate={this.onGetCalendarEndDate()}
                                initialDate={currentMonth}
                                onDateChange={this.onCalendarDateChange}
                                allowRangeSelection={true}
                                allowBackwardRangeSelect={true}
                                maxRangeDuration={maxRangeDuration ? parseInt(maxRangeDuration) - 1 : null}
                                todayBackgroundColor={"transparent"}
                                todayTextStyle={"#666"}
                                minDate={minDate}
                                maxDate={maxDate}
                                weekdays={WEEKDAYS_BY_LANGUAGE[window.LANGUAGE]}
                                months={MONTHS}
                                selectMonthTitle={translate("选择月份 ")}
                                selectYearTitle={translate("选择年份 ")}
                                restrictMonthNavigation={true}
                                previousComponent={this.onRenderCalendarPreviousMonthArrow()}
                                nextComponent={this.onRenderCalendarNextMonthArrow()}
                                onMonthChange={selectedMonth => {
                                    this.setState({
                                        currentMonth: new Date(selectedMonth),
                                    });
                                }}
                                previousTitle=" "
                                nextTitle=" "
                                scaleFactor={375}
                                previousTitleStyle={styles.calendarNavButton}
                                nextTitleStyle={styles.calendarNavButton}
                                selectedDayColor="#E6F6FF"
                                selectedDayTextColor={Color.theme}
                                textStyle={styles.calendarDayText}
                                monthTitleStyle={styles.monthTitleStyle}
                                yearTitleStyle={styles.yearTitleStyle}
                                selectedRangeEndStyle={styles.selectedRangeEndStyle}
                                selectedRangeEndTextStyle={styles.selectedRangeEndTextStyle}
                                selectedRangeStartStyle={styles.selectedRangeStartStyle}
                                selectedRangeStartTextStyle={styles.selectedRangeStartTextStyle}
                                headerWrapperStyle={styles.headerWrapperStyle}
                                dayLabelsWrapper={styles.dayLabelsWrapper}
                            />
                        </View>

                        {/* 确认按钮 */}
                        <View style={styles.confirmButtonContainer}>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={this.onConfirmDateRangeSelection}
                            >
                                <Text style={styles.confirmButtonText}>
                                    {translate("确定共{X}天", { X: selectedDaysCount })}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ColumnCenterCenter>
                </Modal>
            </View>
        );
    }
}

BettingCalendar.propTypes = {
    startDate: PropTypes.number,
    endDate: PropTypes.number,
    maxInterval: PropTypes.number,
    maxRange: PropTypes.number,
    maxRangeDuration: PropTypes.number,
    type: PropTypes.string,
    selectChange: PropTypes.func.isRequired,
    tipText: PropTypes.string,
    showInforText: PropTypes.bool,
    defaultSelectedIndex: PropTypes.number,
};

const mapDispatchToProps = dispatch => ({
    setRouterName: routerName => dispatch(actions.ACTION_RouterName(routerName)),
});

export default connect(null, mapDispatchToProps)(BettingCalendar);

const styles = StyleSheet.create({
    dayLabelsWrapper: {
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    headerWrapperStyle: {
        backgroundColor: "#ffffff",
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 15,
        width: width - 30,
    },
    dropdown_DX_dropdown: {
        height: 37 * 4 + 6,
        marginTop: 12,
        borderColor: "#EBEBEB",
        borderWidth: 1,
        overflow: "hidden",
        marginRight: -10,
        width: 100,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 4,
        borderRadius: 8,
    },
    textnoactive: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "400",
        color: Color.darkGray,
        marginRight: 4
    },
    // Dropdown styles
    dropdownContainer: {
        height: 32,
        position: "relative",
        backgroundColor: Color.white,
        borderRadius: 6,
        paddingHorizontal: 8,
    },
    dropdownRow: {
        height: 38,
        paddingLeft: 10,
        backgroundColor: "#fff",
    },
    dropdownRowText: {
        color: "#6B6B6B",
        fontSize: 12,
        fontWeight: "400"
    },
    dropdownSeparator: {
        height: 1,
        backgroundColor: "#EBEBEB"
    },
    // Modal styles
    modalContainer: {
        backgroundColor: "transparent"
    },
    modalContent: {
        // height: Platform.OS == "ios" ? 550 : 550,
        width: width,
        backgroundColor: "#EFEFF4",
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        overflow: "hidden",
    },
    modalHeader: {
        paddingTop: 20,
        backgroundColor: "#EFEFF4",
        width: "100%",
        paddingHorizontal: 15,
        marginBottom: 18,
    },
    titleText: {
        fontWeight: "bold",
        fontSize: 16,
    },
    resetText: {
        color: "#00a6ff",
        fontSize: 14,
    },
    // Description styles
    descriptionContainer: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    descriptionText: {
        color: "#666",
        fontSize: 14,
        textAlign: "center",
    },
    // Date range display styles
    dateRangeContainer: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    dateRangeText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
        textAlign: "center",
    },
    // Calendar styles
    calendarContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        width: "100%",
    },
    calendarNavButton: {
        color: "#000"
    },
    calendarDayText: {
        color: "#666",
    },
    monthTitleStyle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#222222",
    },
    yearTitleStyle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#222222",
    },
    selectedRangeEndStyle: {
        backgroundColor: "#00A6FF",
        width: 35,
        height: 35,
        borderBottomLeftRadius: 1000000,
        borderBottomRightRadius: 1000000,
        borderTopLeftRadius: 1000000,
        borderTopRightRadius: 1000000,
    },
    selectedRangeEndTextStyle: {
        color: "#fff",
    },
    selectedRangeStartStyle: {
        backgroundColor: "#00A6FF",
        width: 35,
        height: 35,
        borderBottomLeftRadius: 1000000,
        borderBottomRightRadius: 1000000,
        borderTopLeftRadius: 1000000,
        borderTopRightRadius: 1000000,
    },
    selectedRangeStartTextStyle: {
        color: "#fff",
    },
    // Confirm button styles
    confirmButtonContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
        paddingTop: 15,
        width: width,
    },
    confirmButton: {
        backgroundColor: "#00a6ff",
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    // Custom date range display styles (for list type)
    customDateRangeText: {
        fontSize: 12,
        marginRight: 4,
    },
    customDateRangeIconWrap: {
        marginRight: 4,
    },
    // Date range button styles (for list type)
    dateRangeButtonWrap: {
        borderRadius: 9999,
        height: 30,
        paddingHorizontal: 12,
    },
    dateRangeButtonText: {
        fontSize: 12,
    },
});
