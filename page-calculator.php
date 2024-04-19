<?php
/**
 * Template Name: Householding Calculator
 * 
 * @package WordPress
 */
get_header();
global $post;
?>
<?php 
$id =  $post->ID;
$households = get_field( "household_id", $id );
$platforms = get_field( "platform", $id );
$evolution_tires = get_field( "evolution_tire", $id );
$permission = get_field("permission", $id);
$cookie = $_COOKIE["Tiers"];
?>
<div class="calculator section-inner">
    <h2><?php the_title(); ?></h2>
    <div class="calculator_body">
        <label for="number_accounts">How Many Accounts are you Calculating?</label>
        <select name="number_accounts" id="number_accounts">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
        </select>
        <?php
        for ($i=1; $i < 11 ; $i++) { ?>
            <div class="editable account_<?php echo $i;?> <?php if($i == 1) { echo 'active'; } else { echo 'hidden'; } ?>">
                <h3>Account <?php echo $i; ?></h3>
                <div class="calculator_fields">
                    <div class="household">
                        <label for="household_id">Household ID</label>
                        <select name="household_id" id="household_id">
                            <?php foreach ($households as $household) {
                                $household_id = $household['household_id_value'];?>
                                <option value="<?php echo $household_id; ?>" ><?php echo $household_id; ?></option>
                            <?php
                            }
                            ?>
                        </select>
                    </div>
                    <div class="platform">
                        <label for="platform_id">Program</label>
                        <select name="platform_id" id="platform_id">
                            <?php foreach ($platforms as $platform) {
                                $platform_name = $platform['platform_code'];?>
                                <option value="<?php echo $platform_name; ?>" ><?php echo $platform_name; ?></option>
                            <?php
                            }
                            ?>
                        </select>
                    </div>
                    <div class="evolution_tires">
                        <?php
                            foreach($permission as $permission_tier) {
                                $response = $permission_tier['response'];
                                $accessible_tiers = $permission_tier['accessible_tiers'];
                                if($response == $cookie) { ?>
                                    <label for="evolution_tires">Tier</label>
                                    <select name="evolution_tires" id="evolution_tires">
                                    <?php
                                        foreach($accessible_tiers as $accessible_tier) {
                                            echo "<option value='". $accessible_tier['tier']. "'>" . $accessible_tier['tier'] . "</option>";
                                        }
                                    ?>
                                    </select>
                                <?php
                                }
                            }
                        ?>
                    </div>
                    <div class="account_name">
                        <label for="account_name">Account Name</label>
                        <input id="account_name" name="account_name" type="text" >
                    </div>
                    <div class="total_account_val">
                        <label for="total_account_val">Total Account Value</label>
                        <input name="total_account_val" id="total_account_val" type="number" value="0" pi="" >
                    </div>
                    <div class="account_total hidden">
                        <label for="account_total">Account Total</label>
                        <input name="account_total" id = "account_total" type = "text">
                    </div>
                    <div class="household_total hidden">
                        <label for="household_total">Platform Total</label>
                        <input name="household_total" id = "household_total" type = "text">
                    </div>
                    <div class="platform_total hidden">
                        <label for="platform_total">Household Fee Total</label>
                        <input name="platform_total" id = "platform_total" type = "text">
                    </div>
                    <div class="platform_minimum_level hidden">
                        <label for="platform_minimum_level">Platform Minimum Level</label>
                        <input name="platform_minimum_level" id = "platform_minimum_level" type = "text">
                    </div>
                    <div class="investment_mnt_fee hide">
                        <label for="investment_mnt_fee">Invenstment Management Fee</label>
                        <input name="investment_mnt_fee" id = "investment_mnt_fee" type = "hidden" account="account_<?php echo $i; ?>">
                    </div>
                </div>
            </div>
        <?php
        }
        ?>
        <div class="calculations">
            <h3>Calculations</h3>
            <div class="bps">
                <p>Show BPS?</p>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="results">
                <?php
                for ($i=1; $i < 11 ; $i++) { ?>
                    <div class="result account_<?php echo $i;?> <?php if($i == 1) { echo 'active'; } else { echo 'hidden'; } ?>">
                        <label for="result_<?php echo $i;?>">Account <?php echo $i;?> Platform Fee</label>
                        <input type = "text" id = "result_<?php echo $i;?>" account="account_<?php echo $i;?>" readonly>
                    </div>
                <?php
                }
                ?>
            </div>
        </div>
    </div>
</div>
<?php get_footer();