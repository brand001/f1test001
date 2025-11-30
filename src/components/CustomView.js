import React from "react";
import { StyleSheet, View } from "react-native";
import Touch from "react-native-touch-once";

// 统一的 FlexView 组件
const FlexView = ({ children, style, onPress }) => {
    const Component = onPress ? Touch : View;
    return (
        <Component style={style} onPress={onPress}>
            {children}
        </Component>
    );
};

// ===================== Row Components =====================
// Row Center
export const RowCenterCenter = props => <FlexView {...props} style={[styles.rowCenterCenter, props.style]} />;
export const RowCenterStart = props => <FlexView {...props} style={[styles.rowCenterStart, props.style]} />;
export const RowCenterEnd = props => <FlexView {...props} style={[styles.rowCenterEnd, props.style]} />;
export const RowCenterBetween = props => <FlexView {...props} style={[styles.rowCenterBetween, props.style]} />;
export const RowCenterAround = props => <FlexView {...props} style={[styles.rowCenterAround, props.style]} />;
export const RowCenterEvenly = props => <FlexView {...props} style={[styles.rowCenterEvenly, props.style]} />;

// Row Start
export const RowStartCenter = props => <FlexView {...props} style={[styles.rowStartCenter, props.style]} />;
export const RowStartStart = props => <FlexView {...props} style={[styles.rowStartStart, props.style]} />;
export const RowStartEnd = props => <FlexView {...props} style={[styles.rowStartEnd, props.style]} />;
export const RowStartBetween = props => <FlexView {...props} style={[styles.rowStartBetween, props.style]} />;
export const RowStartAround = props => <FlexView {...props} style={[styles.rowStartAround, props.style]} />;
export const RowStartEvenly = props => <FlexView {...props} style={[styles.rowStartEvenly, props.style]} />;

// Row End
export const RowEndCenter = props => <FlexView {...props} style={[styles.rowEndCenter, props.style]} />;
export const RowEndStart = props => <FlexView {...props} style={[styles.rowEndStart, props.style]} />;
export const RowEndEnd = props => <FlexView {...props} style={[styles.rowEndEnd, props.style]} />;
export const RowEndBetween = props => <FlexView {...props} style={[styles.rowEndBetween, props.style]} />;
export const RowEndAround = props => <FlexView {...props} style={[styles.rowEndAround, props.style]} />;
export const RowEndEvenly = props => <FlexView {...props} style={[styles.rowEndEvenly, props.style]} />;

// Row Distribution
export const RowBetweenCenter = props => <FlexView {...props} style={[styles.rowBetweenCenter, props.style]} />;
export const RowBetweenStart = props => <FlexView {...props} style={[styles.rowBetweenStart, props.style]} />;
export const RowBetweenEnd = props => <FlexView {...props} style={[styles.rowBetweenEnd, props.style]} />;
export const RowAroundCenter = props => <FlexView {...props} style={[styles.rowAroundCenter, props.style]} />;
export const RowAroundStart = props => <FlexView {...props} style={[styles.rowAroundStart, props.style]} />;
export const RowAroundEnd = props => <FlexView {...props} style={[styles.rowAroundEnd, props.style]} />;
export const RowEvenlyCenter = props => <FlexView {...props} style={[styles.rowEvenlyCenter, props.style]} />;
export const RowEvenlyStart = props => <FlexView {...props} style={[styles.rowEvenlyStart, props.style]} />;
export const RowEvenlyEnd = props => <FlexView {...props} style={[styles.rowEvenlyEnd, props.style]} />;

// ===================== Column Components =====================
// Column Center
export const ColumnCenterCenter = props => <FlexView {...props} style={[styles.columnCenterCenter, props.style]} />;
export const ColumnCenterStart = props => <FlexView {...props} style={[styles.columnCenterStart, props.style]} />;
export const ColumnCenterEnd = props => <FlexView {...props} style={[styles.columnCenterEnd, props.style]} />;
export const ColumnCenterBetween = props => <FlexView {...props} style={[styles.columnCenterBetween, props.style]} />;
export const ColumnCenterAround = props => <FlexView {...props} style={[styles.columnCenterAround, props.style]} />;
export const ColumnCenterEvenly = props => <FlexView {...props} style={[styles.columnCenterEvenly, props.style]} />;

// Column Start
export const ColumnStartCenter = props => <FlexView {...props} style={[styles.columnStartCenter, props.style]} />;
export const ColumnStartStart = props => <FlexView {...props} style={[styles.columnStartStart, props.style]} />;
export const ColumnStartEnd = props => <FlexView {...props} style={[styles.columnStartEnd, props.style]} />;
export const ColumnStartBetween = props => <FlexView {...props} style={[styles.columnStartBetween, props.style]} />;
export const ColumnStartAround = props => <FlexView {...props} style={[styles.columnStartAround, props.style]} />;
export const ColumnStartEvenly = props => <FlexView {...props} style={[styles.columnStartEvenly, props.style]} />;

// Column End
export const ColumnEndCenter = props => <FlexView {...props} style={[styles.columnEndCenter, props.style]} />;
export const ColumnEndStart = props => <FlexView {...props} style={[styles.columnEndStart, props.style]} />;
export const ColumnEndEnd = props => <FlexView {...props} style={[styles.columnEndEnd, props.style]} />;
export const ColumnEndBetween = props => <FlexView {...props} style={[styles.columnEndBetween, props.style]} />;
export const ColumnEndAround = props => <FlexView {...props} style={[styles.columnEndAround, props.style]} />;
export const ColumnEndEvenly = props => <FlexView {...props} style={[styles.columnEndEvenly, props.style]} />;

// Column Distribution
export const ColumnBetweenCenter = props => <FlexView {...props} style={[styles.columnBetweenCenter, props.style]} />;
export const ColumnBetweenStart = props => <FlexView {...props} style={[styles.columnBetweenStart, props.style]} />;
export const ColumnBetweenEnd = props => <FlexView {...props} style={[styles.columnBetweenEnd, props.style]} />;
export const ColumnAroundCenter = props => <FlexView {...props} style={[styles.columnAroundCenter, props.style]} />;
export const ColumnAroundStart = props => <FlexView {...props} style={[styles.columnAroundStart, props.style]} />;
export const ColumnAroundEnd = props => <FlexView {...props} style={[styles.columnAroundEnd, props.style]} />;
export const ColumnEvenlyCenter = props => <FlexView {...props} style={[styles.columnEvenlyCenter, props.style]} />;
export const ColumnEvenlyStart = props => <FlexView {...props} style={[styles.columnEvenlyStart, props.style]} />;
export const ColumnEvenlyEnd = props => <FlexView {...props} style={[styles.columnEvenlyEnd, props.style]} />;

const styles = StyleSheet.create({
    // ===================== Row Styles =====================
    // Row Center
    rowCenterCenter: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    rowCenterStart: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    rowCenterEnd: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    rowCenterBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rowCenterAround: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    rowCenterEvenly: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },

    // Row Start
    rowStartCenter: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    rowStartStart: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    rowStartEnd: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-start",
    },
    rowStartBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    rowStartAround: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-start",
    },
    rowStartEvenly: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
    },

    // Row End
    rowEndCenter: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
    },
    rowEndStart: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-end",
    },
    rowEndEnd: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    rowEndBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    rowEndAround: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-end",
    },
    rowEndEvenly: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "flex-end",
    },

    // Row Distribution
    rowBetweenCenter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rowBetweenStart: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    rowBetweenEnd: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    rowAroundCenter: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    rowAroundStart: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-start",
    },
    rowAroundEnd: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-end",
    },
    rowEvenlyCenter: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    rowEvenlyStart: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
    },
    rowEvenlyEnd: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "flex-end",
    },

    // ===================== Column Styles =====================
    // Column Center
    columnCenterCenter: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    columnCenterStart: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    columnCenterEnd: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-end",
    },
    columnCenterBetween: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
    },
    columnCenterAround: {
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
    },
    columnCenterEvenly: {
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
    },

    // Column Start
    columnStartCenter: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    columnStartStart: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    columnStartEnd: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-end",
    },
    columnStartBetween: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    columnStartAround: {
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "flex-start",
    },
    columnStartEvenly: {
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
    },

    // Column End
    columnEndCenter: {
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    columnEndStart: {
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-start",
    },
    columnEndEnd: {
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    columnEndBetween: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    columnEndAround: {
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "flex-end",
    },
    columnEndEvenly: {
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "flex-end",
    },

    // Column Distribution
    columnBetweenCenter: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
    },
    columnBetweenStart: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    columnBetweenEnd: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    columnAroundCenter: {
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
    },
    columnAroundStart: {
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "flex-start",
    },
    columnAroundEnd: {
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "flex-end",
    },
    columnEvenlyCenter: {
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    columnEvenlyStart: {
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
    },
    columnEvenlyEnd: {
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "flex-end",
    },
});

// ===================== Exports =====================
export default {
    // Row Exports
    // Row Center
    RowCenterCenter,
    RowCenterStart,
    RowCenterEnd,
    RowCenterBetween,
    RowCenterAround,
    RowCenterEvenly,

    // Row Start
    RowStartCenter,
    RowStartStart,
    RowStartEnd,
    RowStartBetween,
    RowStartAround,
    RowStartEvenly,

    // Row End
    RowEndCenter,
    RowEndStart,
    RowEndEnd,
    RowEndBetween,
    RowEndAround,
    RowEndEvenly,

    // Row Distribution
    RowBetweenCenter,
    RowBetweenStart,
    RowBetweenEnd,
    RowAroundCenter,
    RowAroundStart,
    RowAroundEnd,
    RowEvenlyCenter,
    RowEvenlyStart,
    RowEvenlyEnd,

    // Column Exports
    // Column Center
    ColumnCenterCenter,
    ColumnCenterStart,
    ColumnCenterEnd,
    ColumnCenterBetween,
    ColumnCenterAround,
    ColumnCenterEvenly,

    // Column Start
    ColumnStartCenter,
    ColumnStartStart,
    ColumnStartEnd,
    ColumnStartBetween,
    ColumnStartAround,
    ColumnStartEvenly,

    // Column End
    ColumnEndCenter,
    ColumnEndStart,
    ColumnEndEnd,
    ColumnEndBetween,
    ColumnEndAround,
    ColumnEndEvenly,

    // Column Distribution
    ColumnBetweenCenter,
    ColumnBetweenStart,
    ColumnBetweenEnd,
    ColumnAroundCenter,
    ColumnAroundStart,
    ColumnAroundEnd,
    ColumnEvenlyCenter,
    ColumnEvenlyStart,
    ColumnEvenlyEnd,
};
