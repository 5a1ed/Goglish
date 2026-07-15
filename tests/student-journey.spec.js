import { test, expect } from "@playwright/test";

test.describe("GoGlish Academy Student Journey", () => {
  const uniqueEmail = `test_student_${Date.now()}@goglish.app`;
  const password = "password123";

  test("should register, login, check gated lessons, and complete checkout simulation", async ({ page }) => {
    // 1. Navigate to Register page
    await page.goto("/register");
    await expect(page.locator("h3")).toContainText("أهلاً بك في رحلتك للتفوق");

    // 2. Fill Register Form
    await page.fill("#name", "E2E Test Student");
    await page.fill("#email", uniqueEmail);
    await page.fill("#phone", "01099887766");
    await page.selectOption("#grade", "ثانية ثانوي");
    await page.fill("#password", password);
    await page.fill("#confirmPassword", password);

    // Submit Registration
    await page.click("button[type='submit']");

    // 3. Wait for Redirect to Login
    await page.waitForURL("/login");
    await expect(page.locator("h3")).toContainText("أهلاً بك مجدداً");

    // 4. Fill Login Form
    await page.fill("#email", uniqueEmail);
    await page.fill("#password", password);
    await page.click("button[type='submit']");

    // 5. Wait for Redirect to Dashboard
    await page.waitForURL("/dashboard");
    await expect(page.locator("h2")).toContainText("المواد الدراسية");

    // Verify Course Listing
    const courseCard = page.locator("div:has-text('الفيزياء - الصف الثاني الثانوي')").first();
    await expect(courseCard).toBeVisible();

    // 6. Navigate to Course Lessons
    await courseCard.locator("a:has-text('استعرض المنهج')").click();
    await page.waitForURL(/\/dashboard\/lessons\/\d+/);

    // Verify Free Lesson loads first
    await expect(page.locator("h3")).toContainText("الدرس الأول: الحركة الاهتزازية (مجاني)");
    const videoIframe = page.locator("iframe");
    await expect(videoIframe).toBeVisible();

    // 7. Click Gated Lesson (locked)
    await page.click("button:has-text('الدرس الثاني: الحركة الموجية')");
    await expect(page.locator("p:has-text('هذا الدرس مغلق')")).toBeVisible();

    // 8. Click Purchase Course
    await page.click("button:has-text('شراء المادة بالكامل')");

    // 9. Wait for Success Page Check & Redirect Back
    await page.waitForURL(/\/dashboard\/payments\/success/);
    await expect(page.locator("h3")).toContainText("تم الدفع وتفعيل المادة بنجاح!");

    // Playwright automatically waits for redirect back to lessons
    await page.waitForURL(/\/dashboard\/lessons\/\d+/);

    // 10. Verify Premium Lesson is now unlocked (iframe is shown instead of lock message)
    await page.click("button:has-text('الدرس الثاني: الحركة الموجية')");
    await expect(page.locator("p:has-text('هذا الدرس مغلق')")).not.toBeVisible();
    await expect(videoIframe).toBeVisible();
  });
});
