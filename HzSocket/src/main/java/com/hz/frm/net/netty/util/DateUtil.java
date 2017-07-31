package com.hz.frm.net.netty.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class DateUtil {

    static private final Logger logger = LoggerFactory.getLogger(DateUtil.class);
    // three comman date format
    public static final SimpleDateFormat dashFormat = new SimpleDateFormat("yyyy-MM-dd");
    public static final SimpleDateFormat slashForamt = new SimpleDateFormat("yyyy/MM/dd");
    public static final SimpleDateFormat ymdFormat = new SimpleDateFormat("yyyyMMdd");
    public static final SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
    private static final SimpleDateFormat ymFormat = new SimpleDateFormat("yyyyMM");
    private static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    public static final long M_PER_DAY = 1000 * 60 * 60 * 24;

    /**
     * 取得当前系统时间,仅含日期,时分秒等等设成0
     * 参见getTodayHMS
     * @return
     */
    public static Date getToday() {
    	Date today = new Date();
        return getFormattedDate(today);
    }
    
    
    /**
     * get the default today String with style "yyyy-MM-dd"
     *
     * @return
     */
    public static String getTodayString() {
        return getDateString(getToday());
    }

    public static String getTodayString(String formatString) {
        return getDateString(getToday(), formatString);
    }

    public static String getDateString(Date date, DateFormat format) {
        return format.format(date);
    }

    public static String getDateString(Date date, String formatString) {
        return new SimpleDateFormat(formatString).format(date);
    }

    /**
     * get the default dateString with style "yyyy-MM-dd"
     *
     * @param date
     * @return
     */
    public static String getDateString(Date date) {
        return dashFormat.format(date);
    }

    /**
     * use the default date format "yyyy-MM-dd"
     *
     * @param dStr
     * @return
     */
    public static Date getDate(String dStr) {
        return getDate(dStr, dashFormat);
    }

    synchronized public static Date getDate(String dStr, DateFormat format) {
        if(dStr.trim().equals("")){
            return null;
        }
        format.setLenient(false);
        Date date = null;
        try {
            date = format.parse(dStr);
        } catch (ParseException ex) {
            logger.error("解析日期格式出错", ex);
        }
        return date;
    }

    public static Date getDate(String dStr, String formatString) {
        SimpleDateFormat format = new SimpleDateFormat(formatString);
        return getDate(dStr, format);
    }

    /**
     * assume: 1. endDate should be after beginDate 2. if endDate is 2/29,
     * return true 2. endDate - beginDate can be > 1Y 3. if endDate - beginDate >
     * 1Y, find between beginDate and (endDate-xY), x: the largest number that
     * (endDate-xY) is after beginDate 3. 算头不算尾
     *
     * @param beginDate
     * @param end
     * @return
     */
    public static boolean hasLeapDayInBetween(GregorianCalendar beginDate, Date end) {
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");

        GregorianCalendar endDate = new GregorianCalendar();
        endDate.setTime(end);

        if (beginDate.before(endDate) == false) // illegal setting: endDate
        // should be after beginDate
        {
            return false;
        }

        if (endDate.get(Calendar.MONTH) == Calendar.FEBRUARY && endDate.get(Calendar.DATE) == 29) {
            return true; // endDate is 2/29
        }

        // find (paymentDate-xY), x: the largest number that (paymentDate-xY) is
        // after valueDate
        GregorianCalendar newEndDate = new GregorianCalendar(beginDate.get(Calendar.YEAR), endDate.get(Calendar.MONTH), endDate.get(Calendar.DATE));

        if (newEndDate.after(beginDate) == false) {
            newEndDate = new GregorianCalendar(newEndDate.get(Calendar.YEAR) + 1, newEndDate.get(Calendar.MONTH), newEndDate.get(Calendar.DATE));
        }

        endDate = new GregorianCalendar(newEndDate.get(Calendar.YEAR), newEndDate.get(Calendar.MONTH), newEndDate.get(Calendar.DATE));

        int leapYearIdx = beginDate.get(Calendar.YEAR);
        if (beginDate.isLeapYear(leapYearIdx) == true) // valueDate is in a
        // leap year
        {
            GregorianCalendar cal229 = new GregorianCalendar(leapYearIdx, Calendar.FEBRUARY, 29);

            if (beginDate.after(cal229) == false) // valueDate is at 2/29 or
            // before in a leap year
            {
                if (endDate.after(cal229) == true) // check endDate
                {
                    return true;
                } else {
                    return false;
                }
            } else // beginDate is after 2/29
            {
                return false;
            }
        }

        leapYearIdx += 1; // check next year
        if (beginDate.isLeapYear(leapYearIdx) == true) // the next year is a
        // leap year
        {
            GregorianCalendar next229 = new GregorianCalendar(leapYearIdx, Calendar.FEBRUARY, 29);

            if (endDate.after(next229) == true) // check paymentDate
            {
                return true;
            } else {
                return false;
            }
        }

        return false;
    }

    public static boolean hasLeapDayInBetween(Date calDate, Date paymentDate) {
        GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(calDate);
        return hasLeapDayInBetween(cal, paymentDate);
    }

    public static int getDaysBetween(String date1, String date2) {
        return DateUtil.getDaysBetween(DateUtil.getDate(date1), DateUtil.getDate(date2));
    }

    public static int getDaysBetween(Date preDate, Date nextDate) {
        return (int) ((nextDate.getTime() - preDate.getTime()) / M_PER_DAY);
    }

    /**
     * 假设每月30天的条件下计算两天之相隔天数
     */
    public static int getDaysBetween(Date preDate, Date nextDate, int daysPerYear) {
        GregorianCalendar pre = new GregorianCalendar();
        pre.setTime(preDate);
        GregorianCalendar next = new GregorianCalendar();
        next.setTime(nextDate);
        return (next.get(Calendar.YEAR) - pre.get(Calendar.YEAR)) * daysPerYear
                + (next.get(Calendar.MONTH) - pre.get(Calendar.MONTH)) * 30 + (next.get(Calendar.DATE) - pre.get(Calendar.DATE));

    }

    /**
     * 取得两日间的整年数 1. preDate cannot be after nextDate. if so, return -1
     *
     * @param preDate
     * @param nextDate
     * @return
     */
    public static int getYearsBetween(Date preDate, Date nextDate) {
        if (preDate.after(nextDate) == true) {
            return -1;
        }
        GregorianCalendar valueDate = new GregorianCalendar();
        valueDate.setTime(preDate);
        GregorianCalendar oldNextDate = new GregorianCalendar();
        oldNextDate.setTime(nextDate);

        GregorianCalendar newNextDate = new GregorianCalendar(valueDate.get(Calendar.YEAR), oldNextDate.get(Calendar.MONTH),
                oldNextDate.get(Calendar.DATE));
        // 考虑相等的情况
        if (newNextDate.before(valueDate)) {
            newNextDate = new GregorianCalendar(newNextDate.get(Calendar.YEAR) + 1, newNextDate.get(Calendar.MONTH), newNextDate.get(Calendar.DATE));
        }

        return oldNextDate.get(Calendar.YEAR) - newNextDate.get(Calendar.YEAR);
    }

    /**
     * 得到年限，格式为XX年XX月XX日
     *
     * @param next
     * @param pre
     * @return
     */
    public static int[] getTimeYear(Date pre, Date next) {

        GregorianCalendar preDate = new GregorianCalendar();
        preDate.setTime(pre);
        GregorianCalendar nextDate = new GregorianCalendar();
        nextDate.setTime(next);

        boolean isLeap = nextDate.isLeapYear(nextDate.get(Calendar.YEAR));
        int year = nextDate.get(Calendar.YEAR) - preDate.get(Calendar.YEAR);
        int month = nextDate.get(Calendar.MONTH) - preDate.get(Calendar.MONTH);
        int day;
        if (isSecondMonthMaxDay(nextDate, preDate)) {
            day = 0;
        } else {
            day = nextDate.get(Calendar.DAY_OF_MONTH) - preDate.get(Calendar.DAY_OF_MONTH);
        }

        if (day < 0) {
            nextDate.add(Calendar.MONTH, -1);
            int lastMonth = nextDate.get(Calendar.MONTH);
            day = day + getDay_Month(isLeap, lastMonth);
            month = nextDate.get(Calendar.MONTH) - preDate.get(Calendar.MONTH);
            year = nextDate.get(Calendar.YEAR) - preDate.get(Calendar.YEAR);
        }
        if (month < 0) {
            nextDate.add(Calendar.YEAR, -1);
            month = month + 12;
            year = nextDate.get(Calendar.YEAR) - preDate.get(Calendar.YEAR);
        }

        int[] storeDate = new int[3];
        storeDate[0] = year;
        storeDate[1] = month;
        storeDate[2] = day;
        return storeDate;
    }

    public static boolean isSecondMonthMaxDay(GregorianCalendar next, GregorianCalendar pre) {
        if (next.get(Calendar.MONTH) == 1 && pre.get(Calendar.MONTH) == 1) {
            boolean isLeap1 = next.isLeapYear(next.get(Calendar.YEAR));
            boolean isLeap2 = pre.isLeapYear(pre.get(Calendar.YEAR));
            int next_DayOfMonth = getDay_Month(isLeap1, next.get(Calendar.MONTH));
            int pre_DayOfMonth = getDay_Month(isLeap2, pre.get(Calendar.MONTH));

            if (next.get(Calendar.DAY_OF_MONTH) == next_DayOfMonth
                    && pre.get(Calendar.DAY_OF_MONTH) == pre_DayOfMonth) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    /**
     * 根据月份得到该月的天数（月是以0开始）
     */
    public static int getDay_Month(boolean isLeap, int month) {
        if (month == 0) {
            return 31;
        }
        if (month == 1) {
            if (isLeap) {
                return 29;
            } else {
                return 28;
            }
        }
        if (month == 2) {
            return 31;
        }
        if (month == 3) {
            return 30;
        }
        if (month == 4) {
            return 31;
        }
        if (month == 5) {
            return 30;
        }
        if (month == 6) {
            return 31;
        }
        if (month == 7) {
            return 31;
        }
        if (month == 8) {
            return 30;
        }
        if (month == 9) {
            return 31;
        }
        if (month == 10) {
            return 30;
        }
        if (month == 11) {
            return 31;
        }
        return -1;
    }

    /**
     * format the date to be only yyyyMMdd
     *
     * @param date
     * @return
     */
    public static Date getFormattedDate(Date date) {
        GregorianCalendar gday = new GregorianCalendar();
        gday.setTime(date);
        gday.set(Calendar.HOUR, 0);
        gday.set(Calendar.HOUR_OF_DAY, 0);
        gday.set(Calendar.MINUTE, 0);
        gday.set(Calendar.SECOND, 0);
        gday.set(Calendar.MILLISECOND, 0);

        date = gday.getTime();
        return date;
    }

    /**
     * clean the cal to only yyyyMMdd
     *
     * @param cal
     * @return
     */
    public static GregorianCalendar getCleanCalendar(GregorianCalendar cal) {
        cal.set(Calendar.HOUR, 0);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);

        return cal;
    }

    /**
     * convent method to get days after or before
     *
     * @param date
     * @param days
     * @return
     */
    public static Date getDateAfter(Date date, int days) {
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(GregorianCalendar.DATE, days);
        return calendar.getTime();
    }

    /**
     * convent method to get days after or before
     *
     * @param date
     * @param days
     * @param field
     * @return
     */
    public static Date getDateAfter(Date date, int field, int days) {
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(field, days);
        return calendar.getTime();
    }

    /**
     * convent method to get days after or before
     *
     * @param date
     * @param year
     * @param month
     * @param days
     * @return
     */
    public static Date getDateAfter(Date date, int year, int month, int days) {
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(GregorianCalendar.YEAR, year);
        calendar.add(GregorianCalendar.MONTH, month);
        calendar.add(GregorianCalendar.DATE, days);
        return calendar.getTime();
    }

    public static Date getDateAfterMonth(Date date, int month) {
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(date);

        boolean is229 = false;
        if (calendar.get(Calendar.MONTH) == GregorianCalendar.FEBRUARY && calendar.get(Calendar.DATE) == 29) {
            is229 = true; // calendar is 2/29
        }

        int oldMonthIdx = calendar.get(GregorianCalendar.MONTH);

        calendar.add(GregorianCalendar.YEAR, month / 12);
        calendar.roll(GregorianCalendar.MONTH, month % 12);

        if (is229 == true) {
            if (calendar.isLeapYear(calendar.get(GregorianCalendar.YEAR)) == false
                    && calendar.get(GregorianCalendar.MONTH) == GregorianCalendar.FEBRUARY) {
                calendar.set(GregorianCalendar.DATE, 28);
            } else {
                calendar.set(GregorianCalendar.DATE, 29);
            }
        }

        int newMonthIdx = calendar.get(GregorianCalendar.MONTH);

        if (month > 0 && oldMonthIdx > newMonthIdx) {
            calendar.add(GregorianCalendar.YEAR, 1);
        } else if (month < 0 && oldMonthIdx < newMonthIdx) {
            calendar.add(GregorianCalendar.YEAR, -1);
        }

        return calendar.getTime();
    }

    public static Date getDateAfterYear(Date date, int year) {
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(GregorianCalendar.YEAR, year);
        return calendar.getTime();
    }

    /**
     * convent method to get year for date
     *
     * @param date
     * @return
     */
    public static int getYearForDate(Date date) {
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        return calendar.get(GregorianCalendar.YEAR);
    }

    /**
     * 得到月份，calendar从 0 计数，所以需加一，才为实际所称月
     *
     * @param date
     * @return
     */
    public static int getMonthForDate(Date date) {
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        return calendar.get(GregorianCalendar.MONTH) + 1;
    }

    public static int getDayForDate(Date date) {
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        return calendar.get(GregorianCalendar.DATE);
    }

    /**
     * = 计算剩余期限 2007/09/06 change to A/A 2.29要计算
     *
     * @param valueDate
     * @param maturityDate
     * @return
     */
    public static double getLastYear(Date prevCpnDate, Date valueDate, Date maturityDate, int dayCount, boolean count229) {
        int years = getYearsBetween(valueDate, maturityDate);

        if (years < 0) {
            return 0; // valueDate is after bond maturityDate
        }
        GregorianCalendar latestMat = new GregorianCalendar();
        latestMat.setTime(maturityDate);
        latestMat.set(Calendar.YEAR, latestMat.get(Calendar.YEAR) - years);
        Date latestMatDate = latestMat.getTime();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
        if (sdf.format(valueDate).equals(sdf.format(latestMatDate))) {
            return years;
        }

        int interDays = DateUtil.getDaysBetween(valueDate, latestMatDate);
        if (dayCount == 2 && count229 == false) {
            DateUtil.getDaysBetweenWithoutLeapYear(valueDate, latestMatDate);
        }

        double daysInYear = getDayCountOfYear(prevCpnDate, valueDate);
        if (dayCount == 2) {
            daysInYear = 365;
        }

        return years + (interDays / daysInYear);
    }

    /**
     * 提供方便进行date格式转换的方法
     *
     * @param source
     * @param srcFormat
     * @param desFormat
     * @return
     */
    public static String convertDate(String source, String srcFormat, String desFormat) {
        Date date = getDate(source, srcFormat);
        if (date == null) {
            return source;
        }

        return getDateString(date, desFormat);
    }

    /**
     * 提供方便进行date格式转换的方法
     *
     * @param source
     * @param srcFormat
     * @param desFormat
     * @return
     */
    public static String convertDate(String source, DateFormat srcFormat, DateFormat desFormat) {
        Date date = getDate(source, srcFormat);
        if (date == null) {
            return source;
        }

        return getDateString(date, desFormat);
    }

    /**
     * = 取得该付息区间应使用的一年天数
     *
     * @return
     */
    public static double getDayCountOfYear(Date prevCouponDate, Date valueDate) {

        GregorianCalendar prevDate = new GregorianCalendar();
        prevDate.setTime(prevCouponDate);

        if (prevDate.get(Calendar.MONTH) == Calendar.FEBRUARY && prevDate.get(Calendar.DATE) == 29) {
            return 365.0; // date is 2/29
        }

        GregorianCalendar nextDate = new GregorianCalendar(prevDate.get(Calendar.YEAR) + 1, prevDate.get(Calendar.MONTH),
                prevDate.get(Calendar.DATE));
        double daysPerYear = 365.0;
        if (DateUtil.hasLeapDayInBetween(prevDate, nextDate.getTime()) == true) {
            daysPerYear = 366.0;
        }

        return daysPerYear;
    }

    public static double getDayCountOfYear(Date callDay) {
        Date matDay = callDay;
        Date preDay = DateUtil.getDateAfter(matDay, Calendar.YEAR, -1);

        GregorianCalendar prevDate = new GregorianCalendar();
        prevDate.setTime(preDay);
        if (prevDate.get(Calendar.MONTH) == Calendar.FEBRUARY && prevDate.get(Calendar.DATE) == 29) {
            return 365.0; // date is 2/29
        }

        if (DateUtil.hasLeapDayInBetween(preDay, matDay) == true) {
            return 366.0;
        }

        return 365.0;
    }

    /**
     * 根据给定日期得到该日所在月的天期
     *
     * @param callDay
     * @return
     */
    public static double getDayCountOfMonth(Date callDay) {
        GregorianCalendar date = new GregorianCalendar();
        date.setTime(callDay);

        return date.getActualMaximum(Calendar.DAY_OF_MONTH);
    }

    /**
     * 判断给定的日期是否是该月最后一天
     *
     * @param date
     * @return
     */
    public static boolean isLastDayOfMonth(Date date) {

        GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(date);

        if (cal.get(Calendar.DAY_OF_MONTH) == cal.getActualMaximum(Calendar.DAY_OF_MONTH)) {
            return true;
        }

        return false;
    }

    /**
     * 改变给定的日程为该月的最后一天
     *
     * @param date
     * @return
     */
    public static Date setLastDayOfMonth(Date date) {
        GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(date);

        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));

        return cal.getTime();
    }

    /**
     * 改变给定的日期为该月的第一天
     *
     * @param date
     * @return
     */
    public static Date setFirstDayOfMonth(Date date) {
        GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(date);

        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum(Calendar.DAY_OF_MONTH));

        return cal.getTime();
    }

    /**
     * 2.29日不计息情况下两天之间相隔天数
     * 间有2.29的情况下会比实际天数小一天
     *
     * @param preDate
     * @param nextDate
     * @return
     */
    public static int getDaysBetweenWithoutLeapYear(Date preDate, Date nextDate) {
        int days = DateUtil.getDaysBetween(preDate, nextDate);
        if (DateUtil.hasLeapDayInBetween(preDate, nextDate)) {
            days--;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(nextDate);
        if (calendar.get(Calendar.MONTH)==1 && calendar.get(Calendar.DATE)==29 && !preDate.equals(nextDate))
            days++;

        return days;
    }

    /**
     * 设置小时分钟秒数到传入的日期中
     * 传入的int数组格式为int[] hms = {HH,mm,ss}
     * 如果数组不符合规则,返回null
     * 如果date为空返回null
     *
     * @param date
     * @param hms
     * @return
     */
    public static Date copyHMS(Date date, int[] hms) {
        if (date == null) {
            return null;
        }
        if (hms == null) {
            return null;
        }
        try {
            Calendar c = Calendar.getInstance();
            c.setTime(date);
            c.set(Calendar.HOUR_OF_DAY, hms[0]);
            c.set(Calendar.MINUTE, hms[1]);
            c.set(Calendar.SECOND, hms[2]);
            return c.getTime();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 得到系统时间的时分秒,以int数组形式返回
     *
     * @return
     */
    public static int[] systime2IntArrs() {
        Calendar c = Calendar.getInstance();
        c.setTime(getToday());
        int h = c.get(Calendar.HOUR_OF_DAY);
        int m = c.get(Calendar.MINUTE);
        int s = c.get(Calendar.SECOND);
        return new int[]{h, m, s};
    }

    /**
     * 根据传入字符串,得到时分秒,以int数组形式返回
     * 传入字符串形式为 "HH:mm:ss"
     * 如果字符串为"__:__:__"或者为"",或者为null,以当前系统时间代替
     * 如不符合规范返回null;
     *
     * @param hms
     * @return
     */
    public static int[] timeStr2IntArrs(String hms) {
        if (hms == null) {
            return systime2IntArrs();
        }
        if (hms.equals("__:__:__") || hms.equals("")) {
            return systime2IntArrs();
        } else {
            try {
                String[] arrs = hms.split(":");
                int h = Integer.parseInt(arrs[0]);
                int m = Integer.parseInt(arrs[1]);
                int s = Integer.parseInt(arrs[2]);
                return new int[]{h, m, s};
            } catch (NumberFormatException e) {
                return null;
            }
        }
    }

    /**
     * 判断给定的时间，是否符合HH:mm:ss
     */
    public static String isTime(String time) {
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
        sdf.setLenient(false);
        try {
            sdf.parse(time);
        } catch (ParseException e) {
            return null;
        }
        return time;
    }

    public static Date getDateTime(Date date, String time) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd HH:mm:ss");
        sdf.setLenient(false);
        try {
            return sdf.parse(DateUtil.getDateString(date, DateUtil.ymdFormat) + " " + time);
        } catch (Exception e) {
            return date;
        }
    }

    /**
     * 是否大于系统规定的最早输入日期1997/01/01
     *
     * @param date
     * @return
     */
    public static boolean isBeforeSysFirstDate(Date date) {
        if (date.before(DateUtil.getDate("1997-01-01"))) {
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * 得到当前日期的上一/下一日
     * @param date
     * @param days
     * @return
     */
    public static Date getDateAfterOrBefore(Date date, int days) {
        Date tmpDate = date;
        for (int i = 0; i < Math.abs(days); i++) {
            if (days > 0) {
                tmpDate = DateUtil.getDateAfter(tmpDate, 1);
            } else {
                tmpDate = DateUtil.getDateAfter(tmpDate, -1);
            }
        }
        return tmpDate;
    }

    /**
	 * 得到日期列表中最早的日期
	 * 列表中不能有null值
	 * @param list
	 * @return
	 */
	public static Date getFirstDate(List<Date> list){
		if(list.size() == 0){
			return null;
		}
		return Collections.min(list);
	}  
    
    public static boolean isBetween(Date CompareDate , Date date1 , Date date2)
    {
        if (date2.before(date1))
        {
            Date tmp = date1;
            date1 = date2;
            date2 = tmp;
        }
        if (CompareDate.before(date1) || CompareDate.after(date2))
            return false;
        return true;
    }

    public static boolean isBetweenNotEqual(Date CompareDate , Date date1 , Date date2)
    {
        if (date2.before(date1))
        {
            Date tmp = date1;
            date1 = date2;
            date2 = tmp;
        }
        if (!CompareDate.after(date1) || !CompareDate.before(date2))
            return false;

        return true;
    }
    
    /**
     * 获取离当前日期最近的付息日
     * @return
     */
    public static Date getRecentlyPaymentDate(Date date){
    	GregorianCalendar cal1 = new GregorianCalendar();
    	GregorianCalendar cal2 = new GregorianCalendar();
    	GregorianCalendar cal3 = new GregorianCalendar();
    	GregorianCalendar cal4 = new GregorianCalendar();
		cal1.set(DateUtil.getYearForDate(date),2,21);
		cal2.set(DateUtil.getYearForDate(date),5,21);
		cal3.set(DateUtil.getYearForDate(date),8,21);
		cal4.set(DateUtil.getYearForDate(date),11,21);
		
		if (date.equals(cal1.getTime()) || date.equals(cal2.getTime()) || date.equals(cal3.getTime()) || date.equals(cal4.getTime())) {
			return date;
		}
		
		if (date.before(cal1.getTime())) {
			return cal1.getTime();
		} else if (isBetween(date, cal1.getTime(), cal2.getTime())) {
			return cal2.getTime();
		} else  if (isBetween(date, cal2.getTime(), cal3.getTime())) {
			return cal3.getTime();
		} else if (isBetween(date, cal3.getTime(), cal4.getTime())) {
			return cal4.getTime();
		} else {
			GregorianCalendar cal = new GregorianCalendar();
			cal.set(DateUtil.getYearForDate(date)+1,2,21);
			return cal.getTime();
		}
    }
    
	public static Vector<String> getYearAndMonthVector(){
		Vector<String> item = new Vector<String>();
		int index = -1;
		while(index > -13){
			Date td = DateUtil.getDateAfterMonth(DateUtil.getToday(),index);
			item.add(getDateString(td, ymFormat));
			index--;
		}
		return item;
	}
	
	
	/**
	 * 判定输入的西元年是否是闰年
	 * @param year
	 * @return 是否是闰年
	 */
	public static boolean isLeapYear(int year)
	{
		if(year % 400 == 0) {
			return true ;
		} else if(year % 100 == 0) {
			return false ;
		} else if(year % 4 == 0) {
			return true ;
		} else {
			return false ;
		}
	}
	
	  /**
		 * 比较两个时间相差的秒数
		 * @param enterTime   本次进入时间
		 * @param enterTime_h 上一次进入时间
		 * @param diffNum 相隔秒数临界值(小于等于此值返回true)
		 * @return 小于等于diffNum返回true,其它返回false
		 */
		public static boolean timeDiff(String enterTime,String enterTime_h,int diffNum){
			
			if(isNull(enterTime) ||isNull(enterTime_h)){
				//有值为空,无法比较
				return false;
			}
			
			if(enterTime.contains("/")){
				enterTime = enterTime.replaceAll("/", "-");
			}
			
			long enter_h = 0;
			long enter = 0;
			//取得毫秒数
			try {
				enter_h = sdf.parse(enterTime_h).getTime();
				enter = sdf.parse(enterTime).getTime();
			} catch (ParseException e) {
				e.printStackTrace();
			}
			//进行比较得到秒数,小于60则返回true
			if((enter - enter_h)/1000 <=diffNum){
				return true;
			}else{
				return false;	
			}
		}
		/**
	     * 判断是否为空字符串或者为空。
	     * @param param：需要判断的字符串。
	     * @return false：非空返回  true:空字符串或者null时返回。
	     */
	    public static boolean isNull(String param) {
	    	if (null == param) {
	            return true;
	        } else if (0 == param.trim().length()) {
	            return true;
	        }
	        return false;
	    } 
}