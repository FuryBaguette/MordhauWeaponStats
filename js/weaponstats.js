$(function() {
    $(".overlay").hide();
    var weapons;
    var compareList = [];

    $.getJSON("https://raw.githubusercontent.com/FuryBaguette/MordhauWeaponStats/master/json/weapons.json", function(json) {
        weapons = json.Weapons;
        var weaponLeftTable = $('<table/>');
        var weaponLeftBody = $('<tbody/>');
        var tableHead = $("<thead/>");
        tableHead.append("<th>Name</th><th>Attack Type</th><th>Type</th><th>Alt Mode</th>");
        weaponLeftTable.append(tableHead);
        for (i in weapons) {
            var currentWeapon = weapons[i];
            if (currentWeapon.Name) {
                weaponLeftBody.append("<tr><td>" + currentWeapon.Name + "</td><td>" + currentWeapon.AttackType + "</td><td>" + currentWeapon.Type + "</td><td>" + currentWeapon.AltMode + "</td></tr>");
            }
        }
        weaponLeftTable.append(weaponLeftBody);
        $("#leftSide").append(weaponLeftTable);
    });

    function getWeaponData(name) {
        for (i in weapons) {
            if (weapons[i].Name == name)
                return weapons[i];
        }
        return null;
    }

    function updateValue(valueToUpdate) {
        $("#weapon" + valueToUpdate).remove();
        if (compareList.length > 0) {
            var weaponValueDiv = $('<div/>', { 'id': "weapon" + valueToUpdate, 'class': "infoContainer" });
            var weaponValueTable = $('<table/>')
            weaponValueDiv.append("<div class=\"title-box\"><h4>" + valueToUpdate.split(/(?=[A-Z])/).join(" ") + "</h4></div>");
            var weaponValue;
            var tableHead = $("<thead/>");
            tableHead.append("<th>Name</th><th>Value</th>");
            weaponValueTable.append(tableHead);
            weaponValueTable.append($('<tbody/>'));

            for (i in compareList) {
                weaponValueContainer = $('<tr/>');
                weaponValueWeaponName = $('<td/>');
                weaponValueText = $('<td/>');
                var weaponData = getWeaponData(compareList[i]);
                weaponValueWeaponName.text(weaponData.Name);
                weaponValueText.text(weaponData[valueToUpdate]);
                weaponValueContainer.append(weaponValueWeaponName);
                weaponValueContainer.append(weaponValueText);
                weaponValueTable.first().append(weaponValueContainer);
            }
            weaponValueDiv.append(weaponValueTable);
            $("#rightSide").append(weaponValueDiv);
        }
    }

    function updateArray(value, keys) {
        $("#weapon" + value).remove();
        if (compareList.length > 0) {
            var weaponArrayDiv = $('<div/>', { 'id': "weapon" + value, 'class': "infoContainer" });
            var weaponArrayTable = $('<table/>');
            weaponArrayDiv.append("<div class=\"title-box\"><h4>" + value.split(/(?=[A-Z])/).join(" ") + "</h4></div>");
            var weaponArray;
            var tableHead = $("<thead/>");
            tableHead.append("<th>Name</th>");
            for (i in keys) {
                tableHead.append("<th>" + keys[i] + "</th>");
            }
            weaponArrayTable.append(tableHead);
            weaponArrayTable.append($('<tbody/>'));

            for (i in compareList) {
                weaponArrayContainer = $('<tr/>');
                weaponArrayWeaponName = $('<td/>');
                var weaponData = getWeaponData(compareList[i]);
                weaponArrayWeaponName.text(weaponData.Name);
                weaponArrayContainer.append(weaponArrayWeaponName);
                for (i in keys) {
                    if (value == "Speed") {
                        if (i <= 2 && weaponData[value][0][keys[i]] != "N/A")
                            weaponArrayContainer.append($('<td/>').text(weaponData[value][0][keys[i]] + " ms"));
                        else if (weaponData[value][0][keys[i]] != "N/A")
                            weaponArrayContainer.append($('<td/>').text(weaponData[value][0][keys[i]] + " s"));
                        else
                            weaponArrayContainer.append($('<td/>').text(weaponData[value][0][keys[i]]));
                    }
                    else
                        weaponArrayContainer.append($('<td/>').text(weaponData[value][0][keys[i]]));
                }
                weaponArrayTable.first().append(weaponArrayContainer);
            }
            weaponArrayDiv.append(weaponArrayTable);
            $("#rightSide").append(weaponArrayDiv);
        }
    }

    function updateAllStats() {
        updateValue("AttackType");
        updateValue("Type");
        updateValue("PointCost");
        updateValue("DPS");
        updateValue("Length");
        updateArray("Speed", ["Windup", "Combo", "Release", "AttackSpeed", "ComboSpeed"]);
        updateArray("NoArmorDamage", ["Head", "Torso", "Legs"]);
        updateArray("LightArmorDamage", ["Head", "Torso", "Legs"]);
        updateArray("MediumArmorDamage", ["Head", "Torso", "Legs"]);
        updateArray("HeavyArmorDamage", ["Head", "Torso", "Legs"]);
        updateArray("Stamina", ["MissCost", "FeintCost", "MorphCost", "StaminaDrain", "ParryDrainNegation"]);
        updateArray("TurnCap", ["X", "Y"]);
    }

    $("#rightSide").droppable({
        over: function (event, ui) {
            $("#rightSide .overlay").show();
        },
        out: function () {
            $("#rightSide .overlay").hide();
        },
        drop: function (event, ui) {
            $("#rightSide .overlay").hide();
            for (i in weapons) {
                var currentWeapon = weapons[i];
                if (currentWeapon.Name == ui.draggable.data("name")) {
                    compareList.push(currentWeapon.Name);
                    ui.draggable.attr("style", "");
                    ui.draggable.draggable('disable');
                    $("#rightSide .selectedItemsContainer").append(ui.draggable);
                    updateAllStats();
                }
            }
        }
    });

    $(this).on('click', '#rightSide .weaponNameBox', function() {
        var name = $(this).data("name");
        compareList = $.grep(compareList, function(value) {
            return value != name;
        });
        updateAllStats();
        $(this).remove();
    });

    $(this).on('click', '#leftSide td', function() {
        for (i in weapons) {
            var currentWeapon = weapons[i];
            if (currentWeapon.Name == $(this).text()) {
                compareList.push(currentWeapon.Name);
                var weaponDiv = $('<div/>', { 'class': "weaponNameBox", 'data-name': currentWeapon.Name });
                var weaponName = $('<span/>', { 'class': "weaponName" });
                weaponName.text(currentWeapon.Name);
                weaponDiv.append(weaponName);
                $("#rightSide .selectedItemsContainer").append(weaponDiv);
                updateAllStats();
                break;
            }
        }
    });

    function sortTable(th, table, order){
      var rows = table.find('tr').toArray().sort(compare($(th).index()));
      if(order == 'desc') {
        rows.reverse();
      }
      for(var i=0; i < rows.length; i++){
        table.append(rows[i]);
      }

    }

    function compare(index){
      return function(a,b){
        var valA = $(a).children('td').eq(index).html();
        var valB = $(b).children('td').eq(index).html();
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB);
      }
    }

    $(this).on('click', 'th', function() {
        var rows, shouldSwitch, i, x, y, switchCount = 0;
        var table = $(this).parents("table:first");
        var switching = true;
        var sortType = "asc";

        if ($(this).hasClass('asc')){
            $(this).removeClass('asc').addClass('desc');
            sortTable($(this), table, 'desc');
        } else {
            if($(this).siblings().hasClass('asc') || $(this).siblings().hasClass('desc')) {
                $(this).siblings().removeClass('asc').removeClass('desc');
                $(this).addClass('asc');
                sortTable($(this), table, 'asc');
            } else {
                $(this).addClass('asc');
                sortTable($(this), table, 'asc');
            }
        }
    });
});
