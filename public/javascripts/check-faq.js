$(document).ready(function(){
//khai báo câu hỏi FAQ
var triviaBucket = [
    {
        question: 'Câu 1: Dự án TEN thuộc lĩnh vực nào ?',
        trueAnswer:'A. Giáo dục phi tập trung',
        falseOne: 'B. Thành phố thông minh',
        falseTwo: 'C. Công nghiệp sản xuất'
    },

    {
        question: 'Câu 2: Tại sao dự án TEN Đặc Biệt Nhất trong các hệ thống giáo dục khác ?',
        trueAnswer: 'A. Được cấp chứng chỉ lưu trữ trên Blockchain',
        falseOne: 'B. Có nhiều khóa học',
        falseTwo: 'C. Có nhiều Giảng viên'
    },

    {
        question: "Câu 3: Token TEN có gì nổi bật trong việc thanh toán của hệ thống giáo dục ?",
        trueAnswer: 'A. Sử dụng thuật toán Proof of Content Time',
        falseOne: 'B. Sử dụng thuật toán Proof of Work',
        falseTwo: 'C. Sử dụng thuật toán Proof of Stake'
    },

    {
        question: 'Câu 4: Có bao nhiêu Token TEN được phát hành để đáp ứng toàn bộ hệ sinh thái ? ',
        trueAnswer: 'A. 1.000.000.000 TEN',
        falseOne: 'B. 100.000.000 TEN',
        falseTwo: 'C. 10.000.000.000 TEN',
    },
    {
        question: 'Câu 5: Giá khởi điểm của Token TEN là bao nhiêu ? ',
        trueAnswer: 'A. 0.05 $/ TEN',
        falseOne: 'B.0.08 $/ TEN',
        falseTwo: 'C. 1 $/ TEN'
    }
];

//Biến toàn cục
var clickSwitch = true //BOOLEAN TO SWITCH QUESTIONS ON ANSWER CLICKS
var index = 0;
var correct = 0;
var incorrect = 0;

// Hàm tăng tiến câu hỏi
function incrementQuestion(){
    window.onbeforeunload = function(event){
        return confirm("Confirm refresh");
    };
    index++;
    if(index === 5){
        $('.detail').addClass('disappear');
        $('.result').addClass('appear');
        $("div#wins").html("Đúng: " + correct);
        $("input#send_result").val(correct);
    }

};

//định nghĩa câu hỏi đúng
function populateQuestionArea(){
    $(".questionArea").html(triviaBucket[index].question);
    $("#1_1").html(triviaBucket[index].trueAnswer);
    $("#1_2").html(triviaBucket[index].falseOne);
    $("#1_3").html(triviaBucket[index].falseTwo);
};

//Nút start
$('#startButton').on("click", function(){
    $('.answerBlock').addClass('begin');
    timer();
});
//------------------------------------------

//Hàm đáp án và trả kết quả
$(document).on("click", ".answerBlock", function(){
    var $this = this;
    var clickIdentifier = $(this).attr('id');
    if (clickIdentifier === '1_1') {
        clickSwitch = false;
        correct++;
        $("#wins").html("Đúng: " + correct);
        window.onbeforeunload = function(event){return confirm("Confirm refresh")};
        incrementQuestion();
        populateQuestionArea();
        timer();
    } else {
        clickSwitch = false;
        incorrect++;
        $("#losses").html("Sai! " + incorrect);
        incrementQuestion();
        populateQuestionArea();
        timer();
    }
});

//set thời gian đếm ngược
function timer () {
    populateQuestionArea();
    var countDownTime = 20;
    var counter = setInterval(function(){
        countDownTime -= 1;
        if (countDownTime <= 0 ) {
            clearInterval(counter);
        } else if (countDownTime <= 0 || !clickSwitch) {
            clearInterval(counter);
            intervalTimer();
        }
        $("#timerArea").html(countDownTime + " giây rời câu hỏi!");
    }, 1000);
};
//------------------------------------------

//hàm thời gian chờ chuyển câu hỏi
function intervalTimer () {
var intervalTime = 1; //Countdown time.
var intervalCounter = setInterval(intervalClock, 1000);
function intervalClock(){
    intervalTime -= 1;
    $("#timerArea").html(intervalTime + " giây cho đến câu tiếp theo!");
    if (intervalTime <= 0){
        clearInterval(intervalCounter);
        clickSwitch = true;
        timer();
        }
    }
}
});
