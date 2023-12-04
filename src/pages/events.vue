<template>
    <f7-page name="events" ptr :ptr-mousewheel="true" @ptr:refresh="">
        <f7-navbar title="ค้นหากิจกรรม/รางวัล" back-link="ย้อนกลับ"></f7-navbar>

        <f7-block-title>กรองข้อมูล</f7-block-title>
        <f7-list strong-ios outline-ios dividers-ios>
            <f7-list-item title="ปีการศึกษา" smart-select :smart-select-params="{ openIn: 'sheet' }">
                <select name="year">
                    <option value="2018">2561</option>
                    <option value="2019">2562</option>
                    <option value="2020">2563</option>
                    <option value="2021">2564</option>
                    <option value="2022">2565</option>
                    <option value="2023" selected>2566</option>
                </select>
            </f7-list-item>

            <f7-list-item title="ประเภทกิจกรรม" smart-select :smart-select-params="{ openIn: 'sheet' }">
                <select name="act_type" id="act_type">
                    <option value="0" selected>ไม่เจาะจง</option>
                    <option value="1">อบรม/สัมมนา/ประชุม (ครู/บุคลากร)</option>
                    <option value="2">ค่าย/กิจกรรมเสริม</option>
                    <option value="3">การประกวด/การแข่งขัน/ (ครู/บุคลากร)</option>
                    <option value="4">การประกวด/การแข่งขัน/ (นักเรียน)</option>
                </select>
            </f7-list-item>

            <f7-list-item title="ระดับรางวัล" smart-select :smart-select-params="{ openIn: 'sheet' }">
                <select name="reward" id="reward">
                    <option value="0" selected>ไม่เจาะจง</option>
                    <option value="1">พระราชทาน</option>
                    <option value="2">เชิดชูเกียรติ</option>
                    <option value="3">ชนะเลิศ</option>
                    <option value="4">รองชนะเลิศอันดับ 1</option>
                    <option value="5">รองชนะเลิศอันดับ 2</option>
                    <option value="6">รองชนะเลิศอันดับ 3</option>
                    <option value="7">เหรียญทอง</option>
                    <option value="8">เหรียญเงิน</option>
                    <option value="9">เหรียญทองแดง</option>
                    <option value="10">ชมเชย</option>
                    <option value="11">เข้าร่วม</option>
                </select>
            </f7-list-item>

            <f7-list-item title="ระดับกิจกรรม" smart-select :smart-select-params="{ openIn: 'sheet' }">
                <select name="act_level" id="act_level">
                    <option value="0" selected>ไม่เจาะจง</option>
                    <option value="1">นานาชาติ</option>
                    <option value="2">ชาติ</option>
                    <option value="3">ภาค</option>
                    <option value="4">จังหวัด</option>
                    <option value="5">เขต</option>
                    <option value="6">สหวิทยาเขต</option>
                    <option value="7">โรงเรียน</option>
                    <option value="8">อุดมศึกษา</option>
                </select>
            </f7-list-item>

            <f7-list-item title="กลุ่มสาระ/กลุ่มงาน" smart-select :smart-select-params="{ openIn: 'sheet' }">
                <select name="department" id="department">
                    <option value="0" selected>ไม่เจาะจง</option>
                    <option value="1">กลุ่มบริหาร</option>
                    <option value="2">สารสนเทศโรงเรียน</option>
                    <option value="3">ภาษาไทย</option>
                    <option value="4">วิทยาศาสาสตร์และเทคโนโลยี (วิทยาศาสตร์)</option>
                    <option value="5">วิทยาศาสาสตร์และเทคโนโลยี (เทคโนโลยี)</option>
                    <option value="6">คณิตศาสตร์</option>
                    <option value="7">สังคมศึกษาฯ</option>
                    <option value="8">สุขศึกษาฯ</option>
                    <option value="9">ศิลปะ</option>
                    <option value="10">การงานอาชีพ</option>
                    <option value="11">ภาษาต่างประเทศ</option>
                    <option value="12">English Program</option>
                    <option value="13">ภาษาเอเชียตะวันออก</option>
                    <option value="14">กิจกรรมพัฒนาผู้เรียน</option>
                    <option value="15">E.I.S.</option>
                    <option value="16">การศึกษาค้นคว้าและสร้างองค์ความรู้ (IS)</option>
                    <option value="17">กิจการนักเรียน</option>
                </select>
            </f7-list-item>

            <li class="item-content item-input">
                <div class="item-inner">
                    <div class="item-title item-label">ตั้งแต่วันที่</div>
                    <div class="item-input-wrap">
                        <input name="birthday" type="date" placeholder="เลือก..." />
                    </div>
                </div>
            </li>

            <li class="item-content item-input">
                <div class="item-inner">
                    <div class="item-title item-label">ถึงวันที่</div>
                    <div class="item-input-wrap">
                        <input name="birthday" type="date" placeholder="เลือก..." />
                    </div>
                </div>
            </li>

            <li class="item-content item-input">
                <div class="item-inner">
                    <div class="item-title item-label">ค้นหาจากชื่อกิจกรรม</div>
                    <div class="item-input-wrap">
                        <input name="birthday" type="text" placeholder="ชื่อกิจกรรม..." />
                    </div>
                </div>
            </li>

        </f7-list>
    </f7-page>
</template>