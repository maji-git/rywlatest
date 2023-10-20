<template>
  <f7-page name="settings">
    <f7-navbar title="เกี่ยวกับฉัน"></f7-navbar>

    <br>
    <div class="text-align-center">
      <img src="https://rayongwit.ac.th/ticket/pic/40659s.JPG" class="rounded" height="200">
      <h2>เด็กชายธรรมจิตร กล่ำจันทร์</h2>
      <p>ห้อง 3/3</p>
    </div>

    <f7-list strong outline-ios dividers-ios inset-md accordion-list>
      <f7-list-item accordion-item title="ข้อมูลพื้นฐาน">
        <f7-accordion-content>
          <f7-list>
            <f7-list-item title="ชื่อ นามสกุล">เด็กชายธรรมจิตร กล่ำจันทร์</f7-list-item>
            <f7-list-item title="มัธยมศึกษาปีที่">3</f7-list-item>
            <f7-list-item title="ห้อง">3</f7-list-item>
            <f7-list-item title="แผนการเรียน">Smart Com</f7-list-item>
            <f7-list-item title="รหัสนักเรียน">40659</f7-list-item>
            <f7-list-item title="ครูที่ปรึกษา">
              <ul>
                <li>ครูนนทวัฒน์ ภูมี</li>
                <li>ครูสราวุธ พรหมมาศ</li>
              </ul>
            </f7-list-item>
          </f7-list>
        </f7-accordion-content>
      </f7-list-item>
    </f7-list>
    
    <f7-block class="text-align-center">
      <p>ทำการกรอกข้อมูลพื้นฐานเพื่อใช้งานระบบได้มากขึ้น</p>
      <f7-button fill login-screen-open="#info-register-screen">กรอกข้อมูล</f7-button>
    </f7-block>
  </f7-page>
</template>
