<template>
    <f7-page name="classworks">
        <f7-navbar title="งานในห้อง 3/3"></f7-navbar>

        <f7-block strong inset>
            <div class="d-flex">
                <div class="at-btn-container">
                    <f7-icon material="attachment" class="me-2"></f7-icon>
                </div>
                <input type="text" name="" placeholder="หัวข้องาน" class="text-large">
            </div>

            <textarea name="" cols="30" rows="8" placeholder="เขียนเกี่ยวกับงานในวันนี้..."></textarea>

            <div class="d-flex align-items-center">
                <div>
                    <f7-chip text="วิชา: คณิตศาสตร์" color="purple" class="chip-select">
                        <select>
                            <option value="Hi">คณิตศาสตร์</option>
                            <option value="Hi">วิทยาศาสตร์</option>
                            <option value="Hi">การพัฒนาเว็บ</option>
                            <option value="Hi">การออกแบบและเทคโนโลยี</option>
                        </select>
                    </f7-chip>
                    <f7-chip text="กำหนดส่งก่อน: 26/12/66" class="chip-select"></f7-chip>

                    <f7-chip text="นำเข้าจาก Classroom" color="orange">
                        <template #media>
                            <chip-icon>
                                <f7-icon material="download" class="color-orange" size="14"></f7-icon>
                            </chip-icon>
                        </template>
                    </f7-chip>
                </div>

                <div class="flex-grow-1"></div>
                <f7-button class="send-btn" fill><f7-icon ios="f7:arrow_up" md="material:send"></f7-icon></f7-button>
            </div>
        </f7-block>

        <f7-block-title>26/12/2023</f7-block-title>

        <f7-block strong inset class="mb-2">
            <div class="d-flex">
                <f7-list-item checkbox></f7-list-item>
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center">
                        <f7-chip color="green">วิทยาศาสตร์</f7-chip>
                        <div class="flex-grow-1"></div>
                        <p class="m-0">21/11/2023</p>
                    </div>
                    <h2 class="m-0 mt-2 mb-2">ชิ้นงาน วัสดุในชีวิตประจำวัน</h2>

                    <p class="m-0">หัวข้อ:<br>
                        - พอลิเมอร์<br>
                        - เซรามิก<br>
                        - โลหะ<br>
                        - วัสดุผสม</p>
                </div>
            </div>
        </f7-block>


        <f7-block strong inset class="mt-2">
            <div class="d-flex">
                <f7-list-item checkbox></f7-list-item>
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center">
                        <f7-chip color="orange">สังคมศึกษา</f7-chip>
                        <div class="flex-grow-1"></div>
                        <p class="m-0">21/11/2023</p>
                    </div>
                    <h2 class="m-0 mt-2 mb-2">สรุปตามหัวข้อ</h2>

                    <p class="m-0">ให้สรุปตามหัวข้อที่ได้ลงกระดาษม้วนน้ำตาล ทำชิ้นงานวันพุธหน้า
                        พฤหัสหน้าพรีเซนต์แบบเปลี่ยนฐาน</p>
                </div>
            </div>
        </f7-block>

    </f7-page>
</template>
  
<script setup>

</script>

<style scoped>
.at-btn-container {
    width: 43px;
    height: 43px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>