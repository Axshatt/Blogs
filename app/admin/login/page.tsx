'use client';

import { useActionState } from 'react';
import { loginAction } from '../actions';

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-surface px-margin-mobile font-inter">
      <div className="w-full max-w-md hairline-a bg-surface-container-lowest p-xl">
        <div className="mb-lg">
          <h1 className="text-[28px] font-black uppercase tracking-tighter text-primary">
            Admin Portal
          </h1>
          <p className="text-label-sm uppercase text-on-surface-variant mt-xs">
            Authorized access only
          </p>
        </div>

        <form action={action} className="space-y-md">
          <div>
            <label
              htmlFor="password"
              className="text-label-bold block uppercase text-primary mb-xs"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full border border-outline-variant/50 bg-surface-container-lowest px-md py-sm text-[16px] placeholder:text-outline/70 focus:border-primary focus:outline-none"
            />
          </div>

          {state?.error && (
            <p className="text-label-sm text-error bg-error-container/20 border border-error/20 p-sm uppercase">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="text-label-bold w-full bg-primary py-sm text-on-primary uppercase transition-all duration-200 hover:bg-secondary disabled:opacity-50 cursor-pointer"
          >
            {isPending ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
