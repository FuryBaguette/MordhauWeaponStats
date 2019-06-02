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
        $("#leftSide .keepLong").append(weaponLeftTable);
    });

    function getWeaponData(name) {
        for (i in weapons) {
            if (weapons[i].Name == name)
                return weapons[i];
        }
        return null;
    }

    async function updateValue(valueToUpdate, bestPosition = 0, reverse = false) {
        $("#weapon" + valueToUpdate).remove();
        if (compareList.length > 0) {
            var weaponValueDiv = $('<div/>', { 'id': "weapon" + valueToUpdate, 'class': "infoContainer" });
            var weaponValueTable = $('<table/>')
            weaponValueDiv.append("<div class=\"title-box\"><h2>" + valueToUpdate.split(/(?=[A-Z])/).join(" ") + "</h2></div>");
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

            if (bestPosition > 0 && compareList.length > 1) {
                var min = null, max = null;
                var j = 0;
                var highestElem;
                var lowestElem;
                await weaponValueTable.find("td").each(function () {
                    if (bestPosition == j) {
                        var text = parseFloat($(this).text());
                        if (reverse) {
                            if ((min===null) || (text > min)) { min = text; lowestElem = $(this).parent(); }
                            if ((max===null) || (text < max)) { max = text; highestElem = $(this).parent(); }
                        } else {
                            if ((min===null) || (text < min)) { min = text; lowestElem = $(this).parent(); }
                            if ((max===null) || (text > max)) { max = text; highestElem = $(this).parent(); }
                        }
                        j = 0;
                    } else
                        j++;
                });
                if (min) {
                    lowestElem.removeClass("highestValueItems");
                    lowestElem.addClass("lowestValueItems");
                }
                if (max) {
                    highestElem.removeClass("lowestValueItems");
                    highestElem.addClass("highestValueItems");
                }
            }
            weaponValueDiv.append(weaponValueTable);
            $("#rightSide").append(weaponValueDiv);
        }
    }

    async function updateArray(value, keys, valuesToCalc = null, reverse = false) {
        $("#weapon" + value).remove();
        if (compareList.length > 0) {
            var weaponArrayDiv = $('<div/>', { 'id': "weapon" + value, 'class': "infoContainer" });
            var weaponArrayTable = $('<table/>');
            weaponArrayDiv.append("<div class=\"title-box\"><h2>" + value.split(/(?=[A-Z])/).join(" ") + "</h2></div>");
            var weaponArray;
            var tableHead = $("<thead/>");
            tableHead.append("<th>Name</th>");
            for (i in keys) {
                tableHead.append("<th>" + keys[i].split(/(?=[A-Z])/).join(" ") + "</th>");
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

            if (valuesToCalc != null && compareList.length > 1) {
                var min = null, max = null;
                var highestElem;
                var lowestElem;

                await weaponArrayTable.find("tr").each(function () {
                    var currentWeaponName = $(this).children().first().text();
                    var sum = 0;
                    $.each(weapons, function() {
                        var tmp = $(this);
                        var currentWeapon = tmp[0];
                        if (currentWeapon.Name == currentWeaponName) {
                            for (j in valuesToCalc)
                                sum += currentWeapon[value][0][valuesToCalc[j]];
                        }
                    });
                    sum /= valuesToCalc.length + 1;
                    if (reverse) {
                        if ((min===null) || (sum > min)) { min = sum; lowestElem = $(this); }
                        if ((max===null) || (sum < max)) { max = sum; highestElem = $(this); }
                    } else {
                        if ((min===null) || (sum < min)) { min = sum; lowestElem = $(this); }
                        if ((max===null) || (sum > max)) { max = sum; highestElem = $(this); }
                    }
                });
                if (min) {
                    lowestElem.removeClass("highestValueItems");
                    lowestElem.addClass("lowestValueItems");
                }
                if (max) {
                    highestElem.removeClass("lowestValueItems");
                    highestElem.addClass("highestValueItems");
                }
            }
            weaponArrayDiv.append(weaponArrayTable);
            $("#rightSide").append(weaponArrayDiv);
        }
    }

    async function updateAllStats() {
        updateValue("AttackType");
        updateValue("Type");
        await updateValue("PointCost", 1, true);
        await updateValue("DPS", 1);
        await updateValue("Length", 1);
        await updateArray("Speed", ["Windup", "Combo", "Release", "AttackSpeed", "ComboSpeed"], ["Windup", "Release"], true);
        await updateArray("NoArmorDamage", ["Head", "Torso", "Legs"], ["Head", "Torso", "Legs"]);
        await updateArray("LightArmorDamage", ["Head", "Torso", "Legs"], ["Head", "Torso", "Legs"]);
        await updateArray("MediumArmorDamage", ["Head", "Torso", "Legs"], ["Head", "Torso", "Legs"]);
        await updateArray("HeavyArmorDamage", ["Head", "Torso", "Legs"], ["Head", "Torso", "Legs"]);
        await updateArray("Stamina", ["MissCost", "FeintCost", "MorphCost", "StaminaDrain", "ParryDrainNegation"], ["MissCost", "FeintCost", "MorphCost", "StaminaDrain", "ParryDrainNegation"], true);
        await updateArray("TurnCap", ["X", "Y"], ["X", "Y"]);
    }

    $(this).on('click', '#rightSide .weaponNameBox', function() {
        var name = $(this).data("name");
        compareList = $.grep(compareList, function(value) {
            return value != name;
        });
        $("#leftSide tr").each(function () {
            var child = $(this).children().first();
            if (child.text() == name)
                child.removeClass("selectedItem");
        });
        updateAllStats();
        $(this).remove();
    });

    $(this).on('click', '#leftSide tr', function() {
        var element = $(this).children().first();
        for (i in weapons) {
            var currentWeapon = weapons[i];
            if (currentWeapon.Name == element.text()) {
                if (element.hasClass("selectedItem")) {
                    compareList = $.grep(compareList, function(value) {
                        return value != currentWeapon.Name;
                    });
                    $(".weaponNameBox").each(function (){
                        if ($(this).data("name") == currentWeapon.Name)
                            $(this).remove();
                    });
                    element.removeClass("selectedItem");
                } else {
                    compareList.push(currentWeapon.Name);
                    var weaponDiv = $('<div/>', { 'class': "weaponNameBox", 'data-name': currentWeapon.Name });
                    var weaponName = $('<span/>', { 'class': "weaponName" });
                    weaponName.text(currentWeapon.Name);
                    weaponDiv.append(weaponName);
                    $("#rightSide .selectedItemsContainer").append(weaponDiv);
                    element.addClass("selectedItem");
                }
                updateAllStats();
                break;
            }
        }
    });

    function sortTable(th, table, order){
        var rows = table.find('tr').toArray().sort(compare($(th).index()));
        if(order == 'desc')
            rows.reverse();
        for(i in rows)
            table.append(rows[i]);
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

    function sortBySearch() {
        // uurk, yeah this will need to be dynamic
        var td, textValue;
        var table = $("#leftSide table");
        var filter = $("#searchName").val().toUpperCase();
        var filter1 = $("#attackTypeSelect").val().toUpperCase();
        var filter2 = $("#typeSelect").val().toUpperCase();
        var filter3 = $("#altModeSelect").val().toUpperCase();
        var tr = table.find("tr");

        for (i in tr) {
            if ($(tr[i]).is("tr")) {
                allTd = $(tr[i]).find("td");
                td = allTd.eq(0);
                td1 = allTd.eq(1);
                td2 = allTd.eq(2);
                td3 = allTd.eq(3);
                if (td) {
                    textValue = td.text().toUpperCase();
                    textValue1 = td1.text().toUpperCase();
                    textValue2 = td2.text().toUpperCase();
                    textValue3 = td3.text().toUpperCase();
                    if (textValue.indexOf(filter) >= 0 && textValue1.indexOf(filter1) >= 0 && textValue2.indexOf(filter2) >= 0 && textValue3.indexOf(filter3) >= 0) {
                        $(tr[i]).show();
                    }
                    else
                        $(tr[i]).hide();
                }
            }
        }
    }

    $("#searchName").on('keyup search', function() {
        sortBySearch();
    });

    $("#attackTypeSelect, #typeSelect, #altModeSelect").change(function () {
        sortBySearch();
    });
});
