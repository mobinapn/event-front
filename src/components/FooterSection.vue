<template>
    <div class="new_footer_area">
      <div class="new_footer_top">
        <div class="container">
          <div class="row">
            <div class="col-lg-3 col-md-6">
              <div class="f_widget about-widget q-pr-lg">
                <ul class="list-unstyled f_list">
                  <li class="f-title f_600 t_color f_size_18">Airbnb</li>
                  <li><RouterLink to="/">چرا Airbnb</RouterLink></li>
                  <li><a href="#"> درباره ما</a></li>
                  <li><a href="#">ارتباط با ما </a></li>
                </ul>
              </div>
            </div>
            <div class="col-lg-3 col-md-6 ">
              <div class="f_widget about-widget pl_70">
                <ul class="list-unstyled f_list">
                  <li class="f-title f_600 t_color f_size_18">رزرو سریع </li>
                  <li><a href="#">پرواز</a></li>
                  <li><a href="#"> هتل</a></li>
                  <li><a href="#">پرواز + هتل</a></li>
                </ul>
              </div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div class="f_widget about-widget pl_70">
                <ul class="list-unstyled f_list">
                  <li class="f-title f_600 t_color f_size_18">تور</li>
                  <li><a href="#">تور داخلی</a></li>
                  <li><a href="#">تور خارجی</a></li>
                  <li><a href="#">تور اختصاصی</a></li>
                </ul>
              </div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div class="f_widget social-widget pl_70">
                <h4 class="f-title f_600 t_color f_size_18">مارا دنبال کنید</h4>
                <div class="f_social_icon">
                  <a href="#" class=""><q-icon name="fab fa-instagram" size="24px" /></a>
                  <a href="#" class=""><q-icon name="fab fa-telegram" size="24px" /></a>
                  <a href="#" class=""><q-icon name="fab fa-twitter" size="24px" /></a>
                  <a href="#" class=""><q-icon name="fab fa-linkedin" size="24px" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div class="footer_bg">
          <div class="footer_bg_one"></div>
          <div class="footer_bg_two"></div>
        </div>
      </div>
    </div>
  </template>
  

  <style scoped>

  
  .new_footer_area {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    direction: rtl;
    height: 100%;
    width: 100%;
    bottom: 0;
  }
  .new_footer_top .footer_bg {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 266px;
    background:url("../../public/images/output-onlinepngtools.png") no-repeat scroll center 0 ;
}
  .new_footer_top {
    padding: 90px 0px 240px;
    position: relative;
    overflow-x: hidden;
    background-color: #FFFFFF; /* Airbnb white background */
  }
  
  .new_footer_area .footer_bottom {
    padding-bottom: 50px;
  }
  
  .footer_bottom {
    font-size: 14px;
    font-weight: 300;
    line-height: 20px;
    color: #484848; /* Airbnb text color */
    padding: 27px 0px;
  }
  
  .new_footer_top .company_widget p {
    font-size: 16px;
    font-weight: 300;
    line-height: 28px;
    color: #484848; /* Airbnb text color */
    margin-bottom: 20px;
  }
  
  .new_footer_top .company_widget .f_subscribe_two .btn_get {
    border-width: 1px;
    margin-top: 20px;
  }
  
  a:hover,
  a:focus,
  .btn:hover,
  .btn:focus,
  button:hover,
  button:focus {
    text-decoration: none;
    outline: none;
  }
  
  .new_footer_top .f_widget.about-widget .f_list li a:hover {
    color: #FF5A5F; /* Airbnb primary color */
  }
  
  .new_footer_top .f_widget.about-widget .f_list li {
    margin-bottom: 11px;
  }
  
  .f_widget.about-widget .f_list li:last-child {
    margin-bottom: 0px;
  }
  
  .f_widget.about-widget .f_list li {
    margin-bottom: 15px;
  }
  
  .f_widget.about-widget .f_list {
    margin-bottom: 0px;
  }
  
  .new_footer_top .f_social_icon a {
    width: 44px;
    height: 44px;
    line-height: 43px;
    background: transparent;
    font-size: 24px;
  }
  
  .f_social_icon a {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    font-size: 14px;
    line-height: 45px;
    color: #484848; /* Airbnb text color */
    display: inline-block;
    background: #F7F7F7; /* Airbnb light gray background */
    text-align: center;
    transition: all 0.2s linear;
  }
  
  .new_footer_top .f_social_icon a:hover {
    background: #FF5A5F; /* Airbnb primary color */
    border-color: #FF5A5F; /* Airbnb primary color */
    border-radius: 20px;
    color: white;
  }
  
  .new_footer_top .f_social_icon a + a {
    margin-left: 4px;
  }
  
  .new_footer_top .f-title {
    margin-bottom: 30px;
    color: #000000; /* Airbnb black */
  }
  
  .f_600 {
    font-weight: 600;
  }
  
  .f_size_18 {
    font-size: 18px;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: #484848; /* Airbnb text color */
  }
  
  .new_footer_top .f_widget.about-widget .f_list li a {
    color: #484848; /* Airbnb text color */
    text-decoration: none;
  }
  
  
  .new_footer_top .footer_bg .footer_bg_one {
    background: url("../../public/images/volks.gif") no-repeat center center;
    width: 330px;
    height: 105px;
    background-size: 100%;
    position: absolute;
    bottom: 0;
    left: 30%;
    animation: myfirst 22s linear infinite;
  }
  
  .new_footer_top .footer_bg .footer_bg_two {
    background: url("../../public/images/plane-4979_256.gif") no-repeat center center;
    width: 88px;
    height: 100px;
    background-size: 100%;
    bottom: 80px;
    left: -25%;
    position: absolute;
    transform: scaleX(-1);
    animation: myfirst 30s linear infinite;
  }
  
  @keyframes myfirst {
    0% {
      left: -25%;
    }
    100% {
      left: 100%;
    }
  }
  
  @media screen and (max-width: 900px) {
    .new_footer_area {
      text-align: center;
    }
    .f-title {
      margin-top: 20px;
    }
  }
  </style>