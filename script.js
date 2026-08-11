// ==========================
// ADD CLOTHING
// ==========================

document.getElementById("photoInput").addEventListener("change", function() {

    const file = this.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {

        const img = new Image();

        img.onload = function() {

            // Maximum size for saved clothing photos
            const MAX_SIZE = 1000;

            let width = img.width;
            let height = img.height;

            // Shrink large images while keeping their proportions
            if (width > MAX_SIZE || height > MAX_SIZE) {

                if (width > height) {

                    height = height * (MAX_SIZE / width);
                    width = MAX_SIZE;

                } else {

                    width = width * (MAX_SIZE / height);
                    height = MAX_SIZE;

                }
            }

            // Create a smaller version of the image
            const canvas = document.createElement("canvas");

            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext("2d");

            context.drawImage(
                img,
                0,
                0,
                width,
                height
            );

            // Compress the image
            const compressedImage =
                canvas.toDataURL("image/jpeg", 0.75);


            // Get existing closet
            const closet = JSON.parse(
                localStorage.getItem("closet")
            ) || [];


            // Create new clothing item
            const newItem = {

                id: Date.now() + Math.random(),

                category: selectedCategory,

                image: compressedImage,

                name: "Unnamed Item",

                color: "",

                tags: "",

                favorite: false

            };


            // Add item to closet
            closet.push(newItem);


            try {

                localStorage.setItem(
                    "closet",
                    JSON.stringify(closet)
                );

                refreshCloset();

            } catch (error) {

                console.error(
                    "Could not save clothing item:",
                    error
                );

                alert(
                    "Oops! Your closet is running out of storage space. Try deleting an old clothing item or using a smaller photo."
                );

            }

        };


        img.src = event.target.result;

    };


    reader.readAsDataURL(file);

    // Allows the same photo to be selected again
    this.value = "";

});
