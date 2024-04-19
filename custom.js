jQuery(document).ready(function ($) {
    function Initialize() {
        $(".editable").each(function() {
            var household = $(this).find("#household_id option:selected").text()
            var platform_id = $(this).find("#platform_id option:selected").text()
            var evolution_tires = $(this).find("#evolution_tires option:selected").text()
            fee_schedule = platform_id + "_" + evolution_tires
            unique_platform_id = fee_schedule + " - " + household
            $(this).find("#total_account_val").attr("pi", unique_platform_id)
            $(this).find("#total_account_val").attr("hid", household)
			$(this).find("#account_total").attr("unique_platform_id", unique_platform_id)
            $(this).find("#account_total").attr("household", household)
        })
    }

    function Calc_Tpla() {
        var tpla = []
        var tha = []
        var platform_fee_schedule = []
        $.getJSON("/wp-content/themes/twenty-twenty-child/platform_fee_schedule.json", function(data){
            platform_fee_schedule = data
            $(".editable.active #total_account_val").each(function() {
                let uid = $(this).attr("pi")
                let hid = $(this).attr("hid")
                let val = parseInt($(this).val())
                var acc_val = parseInt("0")
                var hid_val = parseInt("0")
                $(".editable.active .total_account_val #total_account_val").each(function(){
                    if($(this).attr("hid") == hid) {
                        hid_val = hid_val + parseInt($(this).val())
                        if($(this).attr("pi") == uid) {
                            acc_val = acc_val + parseInt($(this).val())
                        }
                    }
                });
    
                var ppv = 100 * val / acc_val
                var phv = 100 * val / hid_val
                $(this).attr("phv", phv)
                var phvi = 100 * acc_val / hid_val
                var first_250k_tier = 0;
                (hid_val > 250000) ? first_250k_tier = Math.max(0, 250000) : first_250k_tier = Math.max(0, hid_val)
    
                var next_250k_tier = 0;
                (hid_val > 500000) ? next_250k_tier = Math.max(0, 250000) : next_250k_tier = Math.max(0, hid_val - 250000)
    
                var next_500k_tier = 0;
                (hid_val > 1000000) ? next_500k_tier = Math.max(0, 500000) : next_500k_tier = Math.max(0, hid_val - 500000)
    
                var next_1m_tier = 0;
                (hid_val > 2000000) ? next_1m_tier = Math.max(0, 1000000) : next_1m_tier = Math.max(0, hid_val - 1000000)
    
                var next_2m_tier = 0;
                (hid_val > 4000000) ? next_2m_tier = Math.max(0, 2000000) : next_2m_tier = Math.max(0, hid_val - 2000000)
    
                var next_4m_tier = 0;
                (hid_val > 8000000) ? next_4m_tier = Math.max(0, 4000000) : next_4m_tier = Math.max(0, hid_val - 4000000)
    
                var platform_id = $(this).closest(".editable").find("#platform_id option:selected").text()
                var evolution_tires = $(this).closest(".editable").find("#evolution_tires option:selected").text()
                fee_schedule = platform_id + "_" + evolution_tires
    
                var first_250k_schedule = platform_fee_schedule.find(item => item.Lookup === "First 250k " + fee_schedule).Platform_Fee;
                var next_250k_schedule = platform_fee_schedule.find(item => item.Lookup === "Next 250k " + fee_schedule).Platform_Fee;
                var next_500k_schedule = platform_fee_schedule.find(item => item.Lookup === "Next 500k " + fee_schedule).Platform_Fee;
                var next_1m_schedule = platform_fee_schedule.find(item => item.Lookup === "Next 1M " + fee_schedule).Platform_Fee;
                var next_2m_schedule = platform_fee_schedule.find(item => item.Lookup === "Next 2M " + fee_schedule).Platform_Fee;
                var next_4m_schedule = platform_fee_schedule.find(item => item.Lookup === "Next 4M " + fee_schedule).Platform_Fee;
    
                var first_250k_final = first_250k_tier * first_250k_schedule * phvi * ppv / 1000000
                var next_250k_final = next_250k_tier * next_250k_schedule * phvi * ppv / 1000000
                var next_500k_final = next_500k_tier * next_500k_schedule * phvi * ppv / 1000000
                var next_1m_final = next_1m_tier * next_1m_schedule * phvi * ppv / 1000000
                var next_2m_final = next_2m_tier * next_2m_schedule * phvi * ppv / 1000000
                var next_4m_final = next_4m_tier * next_4m_schedule * phvi * ppv / 1000000
    
                var account_total = first_250k_final + next_250k_final + next_500k_final + next_1m_final + next_2m_final + next_4m_final
                $(this).closest(".editable").find("#account_total").val(account_total)
    
                var platform_level_min = platform_fee_schedule.find(item => item.Schedule === fee_schedule).Platform_Minimum_Fee;
                $(this).closest(".editable").find("#account_total").attr("platform_level_min", platform_level_min)
                var acc_weighted_platform_min = platform_level_min * ppv / 100
    
                tpla.push(acc_val)
                tha.push(hid_val)
            })

            $(".editable.active #account_total").each(function() {
                let unique_platform_id = $(this).attr("unique_platform_id")
                let household = $(this).attr("household")
                var household_total = parseFloat("0")
                var platform_total = parseFloat("0")
                var household_min_fee = parseFloat("0")
                $(".editable.active input").each(function(){
                    if($(this).attr("household") == household) {
                        household_total = household_total + parseFloat($(this).val())
                        household_min_fee = household_min_fee + parseFloat($(this).attr("platform_level_min"))
                        if($(this).attr("unique_platform_id") == unique_platform_id) {
                            platform_total = platform_total + parseFloat($(this).val())
                        }
                    }
                });
                $(this).closest(".editable").find("#household_total").val(household_total)
                $(this).closest(".editable").find("#platform_total").val(platform_total)
                $(this).closest(".editable").find("#platform_minimum_level").val(household_min_fee)
    
                var acc_weighted_household_min = parseFloat($(this).closest(".editable").find("#platform_minimum_level").val()) * parseFloat($(this).closest(".editable").find("#total_account_val").attr("phv")) / 100;
    
                var total_fee_by_account = 0;
                (household_total > household_min_fee) ? total_fee_by_account = household_total * parseFloat($(this).closest(".editable").find("#total_account_val").attr("phv")) / 100 : total_fee_by_account = acc_weighted_household_min
    
                var investment_mnt_fee = total_fee_by_account / parseFloat($(this).closest(".editable").find("#total_account_val").val()) * 100
    
                $(this).closest(".editable").find("#investment_mnt_fee").val(investment_mnt_fee)
            })

            $(".editable.active #investment_mnt_fee").each(function() {
                let account = $(this).attr("account")
                let bps = Math.round(parseFloat($(this).val()) * 100)
                let val = bps / 100
                $(".result.active input").each(function() {
                    if($(this).attr("account") == account) {
                        if($(".switch input").is(":checked")) {
                            (isNaN(bps)) ? $(this).val(0) : $(this).val(bps + "BPS")
                        }
                        else {
                            (isNaN(val)) ? $(this).val(0) : $(this).val(val + "%")
                        }
                    }
                })
            })
        })        
    }

    Initialize()
    Calc_Tpla()

    $( ".editable select" ).on( "change", function() {
        Initialize()
        Calc_Tpla()
    } );

    $(".editable input").change(function() {
        Initialize()
        Calc_Tpla()
    })

    $("#number_accounts").on( "change", function() {
        var number_accounts = $(this).val()
        $('.editable').each(function(index) {
            if(index < number_accounts) {
                $(this).addClass("active")
                $(this).removeClass("hidden")
            }
            else {
                $(this).addClass("hidden")
                $(this).removeClass("active")
            }
        });
        $('.blended_expense').each(function(index) {
            if(index < number_accounts) {
                $(this).addClass("active")
                $(this).removeClass("hidden")
            }
            else {
                $(this).addClass("hidden")
                $(this).removeClass("active")
            }
        });
        $('.result').each(function(index) {
            if(index < number_accounts) {
                $(this).addClass("active")
                $(this).removeClass("hidden")
            }
            else {
                $(this).addClass("hidden")
                $(this).removeClass("active")
            }
        });
        Initialize()
        Calc_Tpla()
    } );
    $(".switch input").change(function() {
        if(this.checked) {
            $(".result.active input").each(function() {
                var bps = parseFloat($(this).val().split("%")) * 100 + "BPS"
                $(this).val(bps)
            })
        }
        else {
            $(".result.active input").each(function() {
                var percent = parseFloat($(this).val().split("BPS")) / 100 + "%"
                $(this).val(percent)
            })
        }
    })
});