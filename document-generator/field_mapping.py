"""
Maps SDT tag names found in each template to context variable names.

The generator iterates every <w:sdt> element in the document and, if the
tag value is present in a template's mapping, replaces the SDT content with
the corresponding computed value.

Values are strings that reference keys in the context dict built by
utils.build_context().  A leading "!" means the value is a literal string
constant rather than a context key.
"""

# ---------------------------------------------------------------------------
# Helper: build the full tag→context-key mapping from context
# ---------------------------------------------------------------------------

def get_mapping(ctx: dict) -> dict:
    """
    Return a flat {sdt_tag: replacement_value} dict built from ctx.
    Every value is a plain string ready to insert into the document.
    """
    c = ctx  # shorthand

    m = {}

    # ---- Page 1 tags (Master 928) ----
    m["page1_Re"]                      = "Re-"
    m["page1_new_wo_man"]              = c["man_woman_lower"]
    m["page1_new_FirstLast1"]          = c["first_last"]
    m["page1_re"]                      = "re-"
    m["page1_new_FirstMiddleLast1"]    = c["full_name"]
    m["page1_new_BornState"]           = c["birth_state"]
    m["page1_nativeOrnaturalized"]     = c["native_or_naturalized"]
    m["page1_additionalText"]          = c["additional_text"]
    m["page1_First1"]                  = c["first_name"]
    m["page1_Middle1"]                 = c["middle_name"]
    m["page1_Last1"]                   = c["last_name"]
    m["page1_First2"]                  = c["first_name"]
    m["page1_MiddleInitial1"]          = c["middle_initial_no_dot"]
    m["page1_Last2"]                   = c["last_name"]
    m["page1_First3"]                  = c["first_name"]
    m["page1_Last3"]                   = c["last_name"]
    m["page1_FIRST1"]                  = c["first_upper"]
    m["page1_MIDDLE1"]                 = c["middle_upper"]
    m["page1_LAST1"]                   = c["last_upper"]
    m["page1_FIRST2"]                  = c["first_upper"]
    m["page1_MIDDLEINITIAL1"]          = c["middle_initial_no_dot"]
    m["page1_LAST2"]                   = c["last_upper"]
    m["page1_FIRST3"]                  = c["first_upper"]
    m["page1_LAST3"]                   = c["last_upper"]
    m["page1_currentstate"]            = c["current_state"]
    m["page1_Re2"]                     = "Re-"

    # ---- Common date / year / county / state tags ----
    m["Birthdayfromquestion5correction"] = c["birth_date_formal"]
    m["birthyearplus21correction"]       = c["birth_year_plus_21"]
    m["FACurrentMonth"]                  = c["current_month"]
    m["Currentyear"]                     = c["current_year"] + "."
    m["CurretnYear"]                     = c["current_year"] + "."
    m["currentyear"]                     = c["current_year"]
    m["Month"]                           = c["current_month"]
    m["Monthcorr"]                       = c["current_month"]
    m["DState"]                          = c["current_state"]
    m["Dstate"]                          = c["current_state"]
    m["DCounty"]                         = c["current_county"]
    m["Dcounty"]                         = c["current_county"]

    # ---- Identity / gender tags ----
    m["genderinlowerforallcorrection"]   = c["man_woman_lower"]
    m["gendercorr"]                      = c["man_woman_lower"]
    m["gendermissed"]                    = c["man_woman_lower"]
    m["morwmakelower"]                   = c["man_woman_lower"]
    m["morWmakelower"]                   = c["man_woman_lower"]
    m["morwmissed"]                      = c["man_woman_lower"]
    m["Dman"]                            = c["man_woman_lower"]
    m["page12_wo_man"]                   = c["man_woman_lower"]
    m["shehecorr"]                       = c["he_she"]
    m["lowerheshe"]                      = c["he_she"]
    m["heshemissed"]                     = c["he_she"]
    m["heshemakelower"]                  = c["he_she"]
    m["she"]                             = c["he_she"]
    m["shehemakelower"]                  = c["he_she"]
    m["lowerhisher"]                     = c["his_her"]
    m["question18"]                      = c["state_identity"]
    m["StateIdentity"]                   = c["state_identity"]

    # ---- Page 2 / 3 ----
    m["page2_First"]                     = c["first_name"]
    m["page3_Middle"]                    = c["middle_name"]

    # ---- Address / postal fields ----
    m["neednotbeincapscorrctions"]       = c["current_street"]
    m["citycurent city correction"]      = c["current_city"]
    m["CurretnCitymissed"]               = c["current_city"]
    m["CurrentcityMissed"]               = c["current_city"]
    m["CurrentCityMissed"]               = c["current_city"]
    m["CurrentCitymissed"]               = c["current_city"]
    m["POSTALCODEMISSED"]                = c["current_zip"]
    m["CurretnState"]                    = c["current_state"]
    m["currentcity, state"]              = c["current_city_state"]
    m["currentcity, statecorr"]          = c["current_city_state"]
    m["FullPostalAddress"]               = c["post_office_address"]
    m["FAZipcode"]                       = c["post_office_zip"]
    m["AllCapsCounty"]                   = c["current_county"].upper()
    m["AllcapsState"]                    = c["current_state"].upper()
    m["Countyname Countycorr"]           = c["current_county"]

    # ---- Name combination tags ----
    m["removeslashes"]                   = c["birth_date_upper_no_comma"]
    m["firstMiddleIniLastMissed"]        = c["first_mi_last_upper"]
    m["LastnameCond"]                    = c["last_name_cond"]
    m["NeedsSpacesFirstMiddleLast"]      = c["full_name"]
    m["needsspacesfirstmiddlelast"]      = c["full_name"]
    m["First Middle Lastcorr"]           = c["full_name"]
    m["first middle lastcorr"]           = c["full_name"]
    m["first middle last"]               = c["full_name"]
    m["NeedsSpacesFirstMiddleLast"]      = c["full_name"]
    m["LastNee"]                         = c["last_nee_full"]

    # ---- Page 6 ----
    m["page6_re"]                        = "re-"

    # ---- Page 7 caps ----
    m["page7_MONTH"]                     = c["current_month"].upper()
    m["page7_YEAR"]                      = c["current_year"]
    m["page7_FIRSTMIDDLELAST"]           = c["full_name_upper"]
    m["page7_FIRSTMIDDLEINITIALLAST"]    = c["first_mi_last_upper"]
    m["page7_FIRSTLAST"]                 = c["first_upper"] + " " + c["last_upper"]

    # ---- Page 8 ----
    m["page8NameinCaps"]                 = c["full_name_upper"]
    m["page8NameinProper"]               = c["full_name"]
    m["putcommaBirthCity,State"]         = c["birth_state"]

    # ---- Page 9 ----
    m["page9NamewithInitialCaps"]        = c["first_mi_last_upper"]
    m["page9NamewithInitialCaps2"]       = c["name_with_initial_no_dot"]
    m["first middleinitial lastcorr"]    = c["name_with_initial_no_dot"]
    m["fisrt middleinitial lastcorr"]    = c["name_with_initial_no_dot"]

    # ---- Page 10 ----
    m["page10_FIRST1"]                   = c["first_upper"]
    m["page10_LAST1"]                    = c["last_upper"]
    m["page10_First Last"]               = c["first_last"]
    m["BornCity, Statecorr"]             = c["birth_state"]
    m["page10_First Last2"]              = c["first_last"]
    m["page10_First Last3"]              = c["first_last"]

    # ---- Page 11 ----
    m["page11First Middle Last1"]        = c["full_name"]
    m["page11First Middle Last2"]        = c["full_name"]
    m["page11First Middle Last3"]        = c["full_name"]
    m["page11First Middle Last4"]        = c["full_name"]
    m["june 21st, 1984corr"]             = c["birth_date_formal"]

    # ---- Page 12 ----
    m["page12_FirstMiddleLast1"]         = c["full_name"]
    m["page12_FirstMiddleLast2"]         = c["full_name"]
    m["page12_FirstMiddleLast3"]         = c["full_name"]
    m["page12_FirstMiddleInitialLast1"]  = c["name_with_initial_no_dot"]
    m["page12_FirstLast1"]               = c["first_last"]
    m["page12_FIRSTMIDDLELAST1"]         = c["first_mi_last_upper"]
    m["page12_FIRSTMIDDLEINITIALLAST1"]  = c["first_mi_last_upper"]
    m["page12_FIRSTLAST1"]               = c["first_upper"] + " " + c["last_upper"]
    m["page12_birthdatefull1"]           = c["birth_date_formal"]
    m["page12_birthdatefull2"]           = c["birth_date_formal"]

    # ---- Additional birth date tag variants ----
    m["June 21, 1984"]                   = c["birth_date_formal"]
    m["june 21st, 1975corr"]             = c["birth_date_formal"]
    m["removeslashes"]                   = c["birth_date_upper_no_comma"]
    m["firstMiddleIniLastMissed"]        = c["first_mi_last_upper"]

    # ---- Minus-10-years ----
    m["minus10years"]                    = c["current_minus_10_years"]
    m["minus 10 years"]                  = c["current_minus_10_years"]

    # ---- Parental information ----
    m["momfullname (nee' maiden)"]       = c["mother_full_with_nee"]
    m["momfullnameRec"]                  = c["mother_name_married"]
    m["IfMarried"]                       = c["marriage_line"]
    m["ifmarriage2"]                     = c["marriage_line_2"]

    # ---- firstMiddleIniLastMissed alias ----
    m["firstMiddleIniLastMissed"]        = c["first_mi_last_upper"]

    # ---- Email (not needed in V1 — leave blank) ----
    m["youremailcorr"]                   = ""

    # ---- Image placeholders (left blank) ----
    m["Imageone"]                        = ""
    m["ImageTwo"]                        = ""
    m["ImagePhoto"]                      = ""
    m["Image Photo"]                     = ""

    # ---- Fee Schedule specific ----
    m["CurrentYearFee"]                  = c["current_year"]
    m["GenderFee"]                       = c["man_woman_lower"]
    m["firstcorrection"]                 = c["first_name"]
    m["lastcorrection"]                  = c["last_name"]

    # ---- ROE template tags ----
    m["currentDate"]                     = c["current_month_day"]
    m["currentYear"]                     = c["current_year"]
    m["First"]                           = c["first_name"]
    m["Middle"]                          = c["middle_name"]
    m["Last"]                            = c["last_name"]
    m["Maiden"]                          = c["maiden_name"] if c["maiden_name"] else c["last_name"]
    m["FIRST"]                           = c["first_upper"]
    m["MIDDLE"]                          = c["middle_upper"]
    m["LAST"]                            = c["last_upper"]
    m["Address"]                         = c["current_street"]
    m["currentCity"]                     = c["current_city"]
    m["currentState"]                    = c["current_state"]
    m["currentZip"]                      = c["current_zip"]
    m["SSN"]                             = c["ssn"]
    m["BirthState"]                      = c["birth_state"]
    m["STATEABREV"]                      = c["current_state_abbrev"]
    m["County"]                          = c["current_county"]
    m["currentState"]                    = c["current_state"]

    return m


# ---------------------------------------------------------------------------
# Comprehensive placeholder map for ALL untagged SDTs across all templates.
# Keys are the exact placeholder text found in <w:sdtContent>.
# Values are context dict keys returned by build_context().
# ---------------------------------------------------------------------------

COMMON_PLACEHOLDER_MAP = {
    # ---- Month / Year ----
    "Month":                        "current_month",
    "2022":                         "current_year",
    "2021":                         "current_year",
    "April":                        "current_month",   # hardcoded month in Master 928

    # ---- Gender / pronouns ----
    "wo/man":                       "man_woman_lower",
    "s/he":                         "he_she",
    "her/his":                      "his_her",
    "his/her":                      "his_her",
    "daughter/son":                 "daughter_son",

    # ---- Full-name combinations ----
    "First Middle Last":            "full_name",
    "First Last":                   "first_last",
    "First initial Last":           "name_with_initial_no_dot",
    "First Middle Initial Last":    "name_with_initial_no_dot",
    "FIRST MIDDLE LAST":            "full_name_upper",
    "FIRST MIDDLE INITIAL LAST":    "first_mi_last_upper",
    "FIRST LAST":                   "first_last_upper",
    "Last, First Middle":           "last_first_middle",
    # Placeholder names used in templates
    "Jane Marie Smith":             "full_name",
    "John Mark Doe":                "full_name",
    "JANE HEATHER DOE":             "full_name_upper",
    "JOHN MARK DOE":                "full_name_upper",

    # ---- Individual name parts ----
    "First":                        "first_name",
    "Middle":                       "middle_name",
    "Last":                         "last_name",
    "FIRST":                        "first_upper",
    "MIDDLE":                       "middle_upper",
    "LAST":                         "last_upper",
    "MIDDLE initial":               "middle_initial_no_dot",
    "LAST BIRTH NAME":              "last_name_cond",
    "LAST NAME":                    "last_upper",
    "maiden name":                  "maiden_name",
    "dad's full name":              "father_name",   # straight apostrophe
    "dad’s full name":         "father_name",   # curly/smart apostrophe (as stored in template)
    "your birth year":              "birth_year",

    # ---- Address / location ----
    "Street Address":               "current_street",
    "street address":               "current_street",
    "ADDRESS":                      "current_street",
    "Address":                      "current_street",
    "your mailing address":         "current_street",
    "city":                         "current_city",
    "City":                         "current_city",
    "Your city":                    "current_city",
    "State":                        "current_state",
    "County":                       "current_county",
    "City and state":               "current_city_state",
    "City, State":                  "current_city_state",
    "CITY, STATE":                  "current_city_state_upper",
    "Address, City,  State":        "current_full_address",
    "12345":                        "current_zip",
    "37064":                        "current_zip",
    "XXXXX":                        "current_zip",
    "zip-code":                     "current_zip",

    # ---- Birth info ----
    "Born City & State":            "birth_city_state",
    "BORN State":                   "birth_state",
    "[birth] County":               "birth_county",
    "[birth] State":                "birth_state",
}

# Keep the old name as an alias for any external references
FEE_SCHEDULE_PLACEHOLDER_MAP = COMMON_PLACEHOLDER_MAP
