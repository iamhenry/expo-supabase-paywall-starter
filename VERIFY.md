# ✅ RevenueCat Integration – Manual Verification

Use this checklist to ensure everything is wired up correctly before sending a
build to TestFlight.

1. Env vars  
   - [ ] `EXPO_PUBLIC_REVENUECAT_IOS_KEY` set  

2. Build-time integration  
   - [ ] `react-native-purchases` appears in the **`expo prebuild`** or EAS logs  
   - [ ] The generated `Info.plist` contains `Purchases${APP_ID}` entries

3. Runtime behaviour (using dev client or simulator build)  
   - [ ] No `[revenuecat]` warnings on app launch  
   - [ ] Paywall shows loading spinner, then renders products  
   - [ ] Switching to **Airplane Mode** shows the retry UI and recovers after  
         pressing “Try again” once online  
   - [ ] Successful purchase unlocks the correct entitlement and triggers  
         `onPurchaseComplete`  

4. Dashboard data  
   - [ ] Test transaction appears in RevenueCat > Customers  
   - [ ] Active entitlement status matches the purchase  

Tick every box before closing issue #1. Happy shipping! 🚀
