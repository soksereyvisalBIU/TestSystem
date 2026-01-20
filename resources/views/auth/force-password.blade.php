
<div class="container mt-5" style="max-width: 400px;">
    <h3>Set Your New Password</h3>

    <form method="POST" action="/force-password">
        @csrf

        <input type="password" name="password" class="form-control mb-3"
               placeholder="New password" required>

        <input type="password" name="password_confirmation" class="form-control mb-3"
               placeholder="Confirm password" required>

        <button class="btn btn-primary w-100">Update Password</button>
    </form>
</div>

