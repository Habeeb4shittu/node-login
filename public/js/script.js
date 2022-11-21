// alert('dfkjdfdfjhdfkj')
$(".edit").each((i, el) => {
    console.log(el);
    $(el).on('click', () => {

        let id = $(el).data("id")

        $.post(`/edit/${id}`, null, null, "json")
            .done(function (data) {
                // console.log(data);
                $.each(data, (i, el) => {
                    data = el;
                })
                data.forEach(el => {

                    let res = $(`
                    <form class="mode">
                    <div class="forms">
        <label for="firstname">First name:</label>
        <input type="text" name="firstname" id="firstname" value="${el.firstname}">
      </div>
                    <div class="forms">
        <label for="firstname">Last name:</label>
        <input type="text" name="lastname" id="lastname" value="${el.lastname}">
      </div>
                    <div class="forms">
        <label for="email">Email:</label>
        <input type="email" name="email" id="lastname" value="${el.email}">
      </div>
      <div class="forms gender">
    <label>Gender:</label>
    <div>
      <div>
        <label for="male">Male</label>
        <input type="radio" name="gender" id="male" value="${el.gender}">
      </div>
      <div>
        <label for="female">Female</label>
        <input type="radio" name="gender" id="female" value="${el.gender}">
      </div>
    </div>
  </div>
  </form>
                    `)
                    $("#editMode  .modal-body ").empty().append(res)
                })
            })
    })
})