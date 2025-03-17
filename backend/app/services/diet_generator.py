def calculate_bmr(weight, height, age, gender):
    if gender == "male":
        return 10 * weight + 6.25 * height - 5 * age + 5
    else:
        return 10 * weight + 6.25 * height - 5 * age - 161

def calculate_tdee(bmr, activity_level):
    multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "intense": 1.725
    }
    return bmr * multipliers.get(activity_level, 1.2)

def adjust_calories(tdee, goal):
    if goal == "lose_fat":
        return tdee - 500
    elif goal == "gain_muscle":
        return tdee + 300
    return tdee

def calculate_macros(calories, goal):
    if goal == "lose_fat":
        protein_pct, carbs_pct, fats_pct = 0.4, 0.4, 0.2
    elif goal == "gain_muscle":
        protein_pct, carbs_pct, fats_pct = 0.3, 0.5, 0.2
    else:
        protein_pct, carbs_pct, fats_pct = 0.3, 0.4, 0.3

    return {
        "protein_grams": round((calories * protein_pct) / 4),
        "carbs_grams": round((calories * carbs_pct) / 4),
        "fats_grams": round((calories * fats_pct) / 9)
    }
