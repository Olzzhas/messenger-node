module.exports = class UserDto {
   email;
   id;
   image_url;

   constructor(model) {
      (this.email = model.email),
         (this.id = model._id),
         (this.image_url = model.image_url);
   }
};
