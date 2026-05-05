<?php
//app\Http\Requests\StorePatronRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatronRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $patronId = $this->route('patron') ? $this->route('patron')->id : null;

        return [
            'first_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'last_name' => ['required', 'string', 'max:255', 'regex:/^[a-zA-ZñÑ\s\-\,]+$/'],
            'middle_initial' => ['nullable', 'string', 'max:2', 'regex:/^[a-zA-ZñÑ]+$/'],
            'suffix' => ['nullable', 'string', 'in:JR.,SR.,I,II,III,IV,V'],
            'type' => 'required|in:Citizen,Student,Teacher/LGU Staff',
            'gender' => 'required|in:Male,Female,Other',
            'email' => ['required', 'email', 'unique:patrons,email,' . $patronId],
            'contact_number' => ['nullable', 'string', 'regex:/^[0-9]{7,11}$/'],
            'province' => 'required|string|max:255',
            'municipality' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'street' => 'nullable|string|max:255',
            'school' => 'nullable|required_if:type,Student|string|max:255',
            'status' => 'sometimes|in:Active,Suspended',
        ];
    }

    public function messages(): array
    {
        return [
            'contact_number.regex' => 'Contact number must be between 7 and 11 digits.',
            'first_name.regex' => 'Names can only contain letters, spaces, dashes, and commas.',
            'last_name.regex' => 'Names can only contain letters, spaces, dashes, and commas.',
        ];
    }
}
