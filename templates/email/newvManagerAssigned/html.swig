Hi All, 

<p>This is to acknowledge that your client visit request has been accepted and <b>{{anchor.name.first}} {{anchor.name.last}}</b>{% if secondaryVmanager != null %}/<b>{{secondaryVmanager.name.first}} {{secondaryVmanager.name.last}}</b>{% endif %} has been asssigned as the Visit Manager.</p> 

<p>
Primary Visit Manager Contact Details:<br>
Name: {{anchor.name.first}} {{anchor.name.last}}<br>
Email: {{anchor.email}}<br>
Contact No: {{anchor.contactNo[0].contactNumber}}
</p>

{% if secondaryVmanager != null %}
<p>
Secondary Visit Manager Contact Details:<br>
Name: {{secondaryVmanager.name.first}} {{secondaryVmanager.name.last}}<br>
Email: {{secondaryVmanager.email}}<br>
Contact No: {{secondaryVmanager.contactNo[0].contactNumber}}
</p>
{% endif %}
<p>The Visit Manager will get in touch with you shortly to start the Visit Planning.</p>

<p>
Thanks.<br>
CSC India Visit Management Team<br>
<a href="https://c3.csc.com/groups/global-site-visit-management">Connect with us at on C3</a>
</p>