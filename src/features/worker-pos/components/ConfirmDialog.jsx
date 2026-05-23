import React from 'react'

export function ConfirmDialog({
  open,
  title = 'Confirm',
  description = '',
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative z-50 w-full max-w-md rounded-md bg-white p-6">
        <h3 className="text-lg font-bold">{title}</h3>
        {description ? <p className="mt-2 text-sm text-brew-muted">{description}</p> : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-md border border-brew-line bg-white px-4 py-2 text-sm font-bold text-brew-muted"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className="rounded-md bg-brew-coffee px-4 py-2 text-sm font-black text-white"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
