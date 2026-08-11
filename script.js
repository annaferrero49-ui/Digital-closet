let selectedCategory = null;
let selectedItemId = null;
let selectedOutfitCategory = null;
let selectedSavedOutfitId = null;


// ==========================
// ADD CLOTHING MENU
// ==========================

function openCategoryMenu() {
    document.getElementById("categoryMenu").style.display = "flex";
}


function closeCategoryMenu() {
    document.getElementById("categoryMenu").style.display = "none";
}


function selectCategory(category) {

    selectedCategory = category;

    closeCategoryMenu();

    document.getElementById("photoInput").click();
}


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

        const closet = JSON.parse(
            localStorage.getItem("closet")
        ) || [];

        const newItem = {

            id: Date.now() + Math.random(),

            category: selectedCategory,

            image: event.target.result,

            name: "Unnamed Item",

            color: "",

            tags: "",

            favorite: false

        };

        closet.push(newItem);

        localStorage.setItem(
            "closet",
            JSON.stringify(closet)
        );

        refreshCloset();

    };

    reader.readAsDataURL(file);

    this.value = "";

});


// ==========================
// DISPLAY CLOTHING
// ==========================

function displayClothing(item) {

    const card = document.createElement("div");

    card.className = "clothing-card";


    const image = document.createElement("img");

    image.src = item.image;

    card.appendChild(image);


    const name = document.createElement("p");

    name.textContent =
        item.name || "Unnamed Item";

    card.appendChild(name);


    if (item.favorite) {

        const favorite = document.createElement("div");

        favorite.textContent = "⭐ Favorite";

        card.appendChild(favorite);

    }


    card.addEventListener("click", function() {

        openEditMenu(item.id);

    });


    document
        .getElementById(item.category)
        .appendChild(card);

}


// ==========================
// EDIT CLOTHING
// ==========================

function openEditMenu(id) {

    selectedItemId = id;


    const closet = JSON.parse(
        localStorage.getItem("closet")
    ) || [];


    const item = closet.find(function(clothingItem) {

        return clothingItem.id === id;

    });


    if (!item) {
        return;
    }


    document.getElementById("itemName").value =
        item.name || "";


    document.getElementById("itemColor").value =
        item.color || "";


    document.getElementById("itemTags").value =
        item.tags || "";


    document.getElementById("itemFavorite").checked =
        item.favorite || false;


    document.getElementById("editMenu").style.display =
        "flex";

}


function closeEditMenu() {

    document.getElementById("editMenu").style.display =
        "none";

}


// ==========================
// SAVE CLOTHING EDITS
// ==========================

function saveItemChanges() {

    const closet = JSON.parse(
        localStorage.getItem("closet")
    ) || [];


    const item = closet.find(function(clothingItem) {

        return clothingItem.id === selectedItemId;

    });


    if (!item) {
        return;
    }


    item.name =
        document.getElementById("itemName").value;


    item.color =
        document.getElementById("itemColor").value;


    item.tags =
        document.getElementById("itemTags").value;


    item.favorite =
        document.getElementById("itemFavorite").checked;


    localStorage.setItem(
        "closet",
        JSON.stringify(closet)
    );


    closeEditMenu();

    refreshCloset();

}


// ==========================
// DELETE CLOTHING
// ==========================

function deleteSelectedItem() {

    let closet = JSON.parse(
        localStorage.getItem("closet")
    ) || [];


    closet = closet.filter(function(clothingItem) {

        return clothingItem.id !== selectedItemId;

    });


    localStorage.setItem(
        "closet",
        JSON.stringify(closet)
    );


    closeEditMenu();

    refreshCloset();

}


// ==========================
// REFRESH CLOSET
// ==========================

function refreshCloset() {

    document.getElementById("hoodies").innerHTML = "";

    document.getElementById("tops").innerHTML = "";

    document.getElementById("bottoms").innerHTML = "";

    document.getElementById("shoes").innerHTML = "";


    loadCloset();

}


// ==========================
// FIX OLD ITEMS
// ==========================

function fixOldItems() {

    let closet = JSON.parse(
        localStorage.getItem("closet")
    ) || [];


    let changed = false;


    closet.forEach(function(item) {

        if (!item.id) {

            item.id =
                Date.now() + Math.random();

            changed = true;

        }


        if (!item.name) {

            item.name = "Unnamed Item";

            changed = true;

        }


        if (!item.color) {

            item.color = "";

            changed = true;

        }


        if (!item.tags) {

            item.tags = "";

            changed = true;

        }


        if (item.favorite === undefined) {

            item.favorite = false;

            changed = true;

        }

    });


    if (changed) {

        localStorage.setItem(
            "closet",
            JSON.stringify(closet)
        );

    }

}


// ==========================
// LOAD CLOSET
// ==========================

function loadCloset() {

    const closet = JSON.parse(
        localStorage.getItem("closet")
    ) || [];


    closet.forEach(function(item) {

        displayClothing(item);

    });

}


// ==========================
// OUTFIT BUILDER
// ==========================

function openOutfitBuilder() {

    document.getElementById("closet").style.display =
        "none";


    document.getElementById("outfitBuilder").style.display =
        "block";

}


function closeOutfitBuilder() {

    document.getElementById("outfitBuilder").style.display =
        "none";


    document.getElementById("closet").style.display =
        "block";

}


// ==========================
// VISUAL OUTFIT PICKER
// ==========================

function chooseOutfitItem(category) {

    const closet = JSON.parse(
        localStorage.getItem("closet")
    ) || [];


    const items = closet.filter(function(item) {

        return item.category === category;

    });


    if (items.length === 0) {

        alert(
            "You don't have any items in this category yet!"
        );

        return;

    }


    selectedOutfitCategory = category;


    const categoryNames = {

        hoodies: "🧥 Choose a Hoodie / Jacket",

        tops: "👚 Choose a Top",

        bottoms: "👖 Choose Bottoms",

        shoes: "👟 Choose Shoes"

    };


    document.getElementById("pickerTitle").textContent =
        categoryNames[category];


    const choices =
        document.getElementById("outfitChoices");


    choices.innerHTML = "";


    items.forEach(function(item) {

        const choice =
            document.createElement("div");


        choice.className =
            "outfit-choice";


        const image =
            document.createElement("img");


        image.src = item.image;


        const name =
            document.createElement("p");


        name.textContent =
            item.name || "Unnamed Item";


        choice.appendChild(image);

        choice.appendChild(name);


        choice.addEventListener(
            "click",
            function() {

                displayOutfitItem(
                    category,
                    item
                );


                closeOutfitPicker();

            }
        );


        choices.appendChild(choice);

    });


    document.getElementById("outfitPicker").style.display =
        "flex";

}


// ==========================
// DISPLAY OUTFIT ITEM
// ==========================

function displayOutfitItem(category, item) {

    const container =
        document.getElementById(
            "outfit-" + category
        );


    container.innerHTML = "";


    const image =
        document.createElement("img");


    image.src = item.image;


    image.style.width = "100%";


    image.style.height = "180px";


    image.style.objectFit = "contain";


    image.style.borderRadius = "12px";


    container.appendChild(image);


    const name =
        document.createElement("p");


    name.textContent =
        item.name || "Unnamed Item";


    container.appendChild(name);

}


// ==========================
// CLOSE OUTFIT PICKER
// ==========================

function closeOutfitPicker() {

    document.getElementById(
        "outfitPicker"
    ).style.display =
        "none";

}


// ==========================
// GET CURRENT OUTFIT ITEM
// ==========================

function getCurrentOutfitItem(category) {

    const container =
        document.getElementById(
            "outfit-" + category
        );


    const image =
        container.querySelector("img");


    if (!image) {

        return null;

    }


    const closet = JSON.parse(
        localStorage.getItem("closet")
    ) || [];


    return closet.find(function(item) {

        return item.image === image.src;

    }) || null;

}


// ==========================
// SAVE CURRENT OUTFIT
// ==========================

function saveCurrentOutfit() {

    const hoodie =
        getCurrentOutfitItem("hoodies");


    const top =
        getCurrentOutfitItem("tops");


    const bottoms =
        getCurrentOutfitItem("bottoms");


    const shoes =
        getCurrentOutfitItem("shoes");


    if (!top && !bottoms && !shoes) {

        alert(
            "Pick some clothes before saving your outfit!"
        );

        return;

    }


    const outfitName = prompt(
        "What do you want to call this outfit?"
    );


    if (outfitName === null) {

        return;

    }


    const outfitTags = prompt(
        "Add tags separated by commas.\nExample: school, casual, summer"
    );


    if (outfitTags === null) {

        return;

    }


    const outfit = {

        id: Date.now(),

        name:
            outfitName.trim() ||
            "Unnamed Outfit",

        tags:
            outfitTags
                .split(",")
                .map(function(tag) {
                    return tag.trim().toLowerCase();
                })
                .filter(function(tag) {
                    return tag !== "";
                }),

        hoodie: hoodie,

        top: top,

        bottoms: bottoms,

        shoes: shoes

    };


    const savedOutfits = JSON.parse(
        localStorage.getItem("savedOutfits")
    ) || [];


    savedOutfits.push(outfit);


    localStorage.setItem(
        "savedOutfits",
        JSON.stringify(savedOutfits)
    );


    alert(
        "✨ " + outfit.name + " saved!"
    );

}


// ==========================
// SAVED OUTFITS
// ==========================

function openSavedOutfits() {

    document.getElementById("closet").style.display =
        "none";


    document.getElementById("savedOutfitsScreen").style.display =
        "block";


    updateOutfitTagFilter();

    displaySavedOutfits();

}


function closeSavedOutfits() {

    document.getElementById("savedOutfitsScreen").style.display =
        "none";


    document.getElementById("closet").style.display =
        "block";

}


// ==========================
// DISPLAY SAVED OUTFITS
// ==========================

function displaySavedOutfits() {

    const list =
        document.getElementById("savedOutfitsList");


    list.innerHTML = "";


    const savedOutfits = JSON.parse(
        localStorage.getItem("savedOutfits")
    ) || [];


    if (savedOutfits.length === 0) {

        list.innerHTML =
            "<p>You haven't saved any outfits yet! 👗</p>";

        return;

    }


    savedOutfits.forEach(function(outfit, index) {

        const card =
            document.createElement("div");


        card.className =
            "saved-outfit-card";


        const title =
            document.createElement("h3");


        title.textContent =
            outfit.name ||
            "Outfit " + (index + 1);


        card.appendChild(title);


        if (
            outfit.tags &&
            outfit.tags.length > 0
        ) {

            const tags =
                document.createElement("p");


            tags.textContent =
                "🏷️ " +
                outfit.tags
                    .map(function(tag) {
                        return "#" + tag;
                    })
                    .join(" ");


            card.appendChild(tags);

        }


        const pieces =
            document.createElement("div");


        pieces.className =
            "saved-outfit-pieces";


        const items = [

            outfit.hoodie,
            outfit.top,
            outfit.bottoms,
            outfit.shoes

        ];


        items.forEach(function(item) {

            if (!item) {

                return;

            }


            const image =
                document.createElement("img");


            image.src =
                item.image;


            image.alt =
                item.name ||
                "Clothing item";


            pieces.appendChild(image);

        });


        card.appendChild(pieces);


        card.onclick = function() {

            openSavedOutfitDetails(
                outfit.id
            );

        };


        list.appendChild(card);

    });

}


// ==========================
// OUTFIT TAG FILTER
// ==========================

function updateOutfitTagFilter() {

    const savedOutfits = JSON.parse(
        localStorage.getItem("savedOutfits")
    ) || [];


    const filter =
        document.getElementById(
            "outfitTagFilter"
        );


    if (!filter) {

        return;

    }


    filter.innerHTML = "";


    const allOption =
        document.createElement("option");


    allOption.value = "all";


    allOption.textContent =
        "All Outfits";


    filter.appendChild(allOption);


    const tags = [];


    savedOutfits.forEach(function(outfit) {

        (outfit.tags || []).forEach(function(tag) {

            if (!tags.includes(tag)) {

                tags.push(tag);

            }

        });

    });


    tags.sort();


    tags.forEach(function(tag) {

        const option =
            document.createElement("option");


        option.value = tag;


        option.textContent =
            "#" + tag;


        filter.appendChild(option);

    });

}


// ==========================
// FILTER SAVED OUTFITS
// ==========================

function filterSavedOutfits() {

    const selectedTag =
        document.getElementById(
            "outfitTagFilter"
        ).value;


    const savedOutfits = JSON.parse(
        localStorage.getItem("savedOutfits")
    ) || [];


    const list =
        document.getElementById(
            "savedOutfitsList"
        );


    list.innerHTML = "";


    let outfitsToDisplay;


    if (selectedTag === "all") {

        outfitsToDisplay =
            savedOutfits;

    } else {

        outfitsToDisplay =
            savedOutfits.filter(
                function(outfit) {

                    return (
                        outfit.tags &&
                        outfit.tags.includes(
                            selectedTag
                        )
                    );

                }
            );

    }


    if (outfitsToDisplay.length === 0) {

        list.innerHTML =
            "<p>No outfits found with this tag. 🥲</p>";

        return;

    }


    outfitsToDisplay.forEach(
        function(outfit, index) {

            const card =
                document.createElement("div");


            card.className =
                "saved-outfit-card";


            const title =
                document.createElement("h3");


            title.textContent =
                outfit.name ||
                "Outfit " + (index + 1);


            card.appendChild(title);


            if (
                outfit.tags &&
                outfit.tags.length > 0
            ) {

                const tags =
                    document.createElement("p");


                tags.textContent =
                    "🏷️ " +
                    outfit.tags
                        .map(function(tag) {
                            return "#" + tag;
                        })
                        .join(" ");


                card.appendChild(tags);

            }


            const pieces =
                document.createElement("div");


            pieces.className =
                "saved-outfit-pieces";


            const items = [

                outfit.hoodie,
                outfit.top,
                outfit.bottoms,
                outfit.shoes

            ];


            items.forEach(function(item) {

                if (!item) {

                    return;

                }


                const image =
                    document.createElement("img");


                image.src =
                    item.image;


                image.alt =
                    item.name ||
                    "Clothing item";


                pieces.appendChild(image);

            });


            card.appendChild(pieces);


            card.onclick = function() {

                openSavedOutfitDetails(
                    outfit.id
                );

            };


            list.appendChild(card);

        }
    );

}


// ==========================
// SAVED OUTFIT DETAILS
// ==========================

function openSavedOutfitDetails(id) {

    selectedSavedOutfitId = id;


    const savedOutfits = JSON.parse(
        localStorage.getItem("savedOutfits")
    ) || [];


    const outfit = savedOutfits.find(function(item) {

        return item.id === id;

    });


    if (!outfit) {

        return;

    }


    document.getElementById(
        "savedOutfitTitle"
    ).textContent =
        outfit.name || "Unnamed Outfit";


    const tags =
        outfit.tags || [];


    document.getElementById(
        "savedOutfitTags"
    ).textContent =
        tags.length > 0
            ? tags.map(function(tag) {
                return "#" + tag;
            }).join(" ")
            : "No tags";


    document.getElementById(
        "savedOutfitDetails"
    ).style.display =
        "flex";

}


function closeSavedOutfitDetails() {

    document.getElementById(
        "savedOutfitDetails"
    ).style.display =
        "none";

}


// ==========================
// EDIT SAVED OUTFIT
// ==========================

function editSavedOutfit() {

    const savedOutfits = JSON.parse(
        localStorage.getItem("savedOutfits")
    ) || [];


    const outfit = savedOutfits.find(function(item) {

        return item.id === selectedSavedOutfitId;

    });


    if (!outfit) {

        return;

    }


    document.getElementById(
        "savedOutfitName"
    ).value =
        outfit.name || "";


    document.getElementById(
        "savedOutfitTagsInput"
    ).value =
        (outfit.tags || []).join(", ");


    document.getElementById(
        "savedOutfitDetails"
    ).style.display =
        "none";


    document.getElementById(
        "editSavedOutfitMenu"
    ).style.display =
        "flex";

}


function closeEditSavedOutfit() {

    document.getElementById(
        "editSavedOutfitMenu"
    ).style.display =
        "none";

}


function saveSavedOutfitChanges() {

    const savedOutfits = JSON.parse(
        localStorage.getItem("savedOutfits")
    ) || [];


    const outfit = savedOutfits.find(function(item) {

        return item.id === selectedSavedOutfitId;

    });


    if (!outfit) {

        return;

    }


    const newName =
        document.getElementById(
            "savedOutfitName"
        ).value.trim();


    const newTags =
        document.getElementById(
            "savedOutfitTagsInput"
        ).value
        .split(",")
        .map(function(tag) {
            return tag.trim().toLowerCase();
        })
        .filter(function(tag) {
            return tag !== "";
        });


    outfit.name =
        newName || "Unnamed Outfit";


    outfit.tags =
        newTags;


    localStorage.setItem(
        "savedOutfits",
        JSON.stringify(savedOutfits)
    );


    closeEditSavedOutfit();

    updateOutfitTagFilter();

    displaySavedOutfits();

}


// ==========================
// DELETE SAVED OUTFIT
// ==========================

function deleteSavedOutfit() {

    const savedOutfits = JSON.parse(
        localStorage.getItem("savedOutfits")
    ) || [];


    const outfit = savedOutfits.find(function(item) {

        return item.id === selectedSavedOutfitId;

    });


    if (!outfit) {

        return;

    }


    const confirmed = confirm(
        'Are you sure you want to delete "' +
        (outfit.name || "this outfit") +
        '"?'
    );


    if (!confirmed) {

        return;

    }


    const updatedOutfits =
        savedOutfits.filter(function(item) {

            return item.id !== selectedSavedOutfitId;

        });


    localStorage.setItem(
        "savedOutfits",
        JSON.stringify(updatedOutfits)
    );


    closeSavedOutfitDetails();

    updateOutfitTagFilter();

    displaySavedOutfits();

}


// ==========================
// START APP
// ==========================

fixOldItems();

loadCloset();
// ==========================
// BOTTOM NAVIGATION
// ==========================

function goToCloset() {

    document.getElementById("closet").style.display =
        "block";

    document.getElementById("outfitBuilder").style.display =
        "none";

    document.getElementById("savedOutfitsScreen").style.display =
        "none";

}


function goToOutfitBuilder() {

    document.getElementById("closet").style.display =
        "none";

    document.getElementById("outfitBuilder").style.display =
        "block";

    document.getElementById("savedOutfitsScreen").style.display =
        "none";

}


function goToSavedOutfits() {

    document.getElementById("closet").style.display =
        "none";

    document.getElementById("outfitBuilder").style.display =
        "none";

    document.getElementById("savedOutfitsScreen").style.display =
        "block";

    updateOutfitTagFilter();

    displaySavedOutfits();

}