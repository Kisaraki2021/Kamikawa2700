var renderClass = "jp.ngt.rtm.render.VehiclePartsRenderer";
importPackage(Packages.org.lwjgl.opengl);
importPackage(Packages.jp.ngt.rtm.render);
importPackage(Packages.jp.ngt.ngtlib.math);
importPackage(Packages.jp.ngt.ngtlib.util);

function init(par1, par2)
{
	body = renderer.registerParts(new Parts("exterior","b-obj1","interior","front","cab","skirt","equipment","in_car_equipment","in_car_equipment_mx","through_door","hood","wc", "ATS_PANEL","panta_C1","panta_D2"));
	lightF = renderer.registerParts(new Parts("lightF"));
	lightB = renderer.registerParts(new Parts("lightB"));
	door_LF = renderer.registerParts(new Parts("doorFL"));
	door_RF = renderer.registerParts(new Parts("doorFR"));
	door_LB = renderer.registerParts(new Parts("doorBL"));
	door_RB = renderer.registerParts(new Parts("doorBR"));
	alpha = renderer.registerParts(new Parts("alpha"));
	door_LFa = renderer.registerParts(new Parts("doorFL1"));
	door_RFa = renderer.registerParts(new Parts("doorFR1"));
	door_LBa = renderer.registerParts(new Parts("doorBL1"));
	door_RBa = renderer.registerParts(new Parts("doorBR1"));
	pantaC11 = renderer.registerParts(new Parts("panta_C1_1"));
	pantaC12 = renderer.registerParts(new Parts("panta_C1_2"));
	pantaC13 = renderer.registerParts(new Parts("panta_C1_3"));
	pantaC14 = renderer.registerParts(new Parts("panta_C1_4"));
	pantaC15 = renderer.registerParts(new Parts("panta_C1_5"));
	pantaD21 = renderer.registerParts(new Parts("panta_D2_1"));
	pantaD22 = renderer.registerParts(new Parts("panta_D2_2"));
	pantaD23 = renderer.registerParts(new Parts("panta_D2_3"));
	pantaD24 = renderer.registerParts(new Parts("panta_D2_4"));
	pantaD25 = renderer.registerParts(new Parts("panta_D2_5"));
	doorFon = renderer.registerParts(new Parts("doorFon"));
	doorFoff = renderer.registerParts(new Parts("doorFoff"));
	doorFona = renderer.registerParts(new Parts("doorFon1"));
	doorFoffa = renderer.registerParts(new Parts("doorFoff1"));
	ExLFon = renderer.registerParts(new Parts("ExLFon"));
	ExLFoff = renderer.registerParts(new Parts("ExLFoff"));
	K_ATS = renderer.registerParts(new Parts("K_ATS"));
	ATS_B = renderer.registerParts(new Parts("ATS_B"));
	ATS_PA = renderer.registerParts(new Parts("ATS_PA"));
	NO_ATS = renderer.registerParts(new Parts("NO_ATS"));
	L0 = renderer.registerParts(new Parts("L0"));
	L15 = renderer.registerParts(new Parts("L15"));
	L25 = renderer.registerParts(new Parts("L25"));
	L35 = renderer.registerParts(new Parts("L35"));
	L45 = renderer.registerParts(new Parts("L45"));
	L55 = renderer.registerParts(new Parts("L55"));
	L65 = renderer.registerParts(new Parts("L65"));
	L75 = renderer.registerParts(new Parts("L75"));
	L85 = renderer.registerParts(new Parts("L85"));
	L95 = renderer.registerParts(new Parts("L95"));
	L100 = renderer.registerParts(new Parts("L100"));
	L110 = renderer.registerParts(new Parts("L110"));
	L120 = renderer.registerParts(new Parts("L120"));
	L130 = renderer.registerParts(new Parts("L130"));
	L140 = renderer.registerParts(new Parts("L140"));
	L150 = renderer.registerParts(new Parts("L150"));
	L160 = renderer.registerParts(new Parts("L160"));
}

//##### 号車取得 ####################
function isMiddleCar(entity){
	var formation = entity.getFormation();
	if(formation==null){
	  return false;
	}
	var current = formation.getEntry(entity).entryId +1;
	var max = formation.size();
	if(current==1||current==max){
	  return false;
	}
	else{
	  return true;
	}
  }

  //##### 隣接車両取得 ####################
  function isFrontNextCar(entity){
	  var frontNext = entity.getConnectedTrain(0);
		if(frontNext==null){
		  return false;
		}else{
		  return true;
		}
  }

  //#### カスタムボタン情報取得 ############
  function getKeyState(entity, key){
	if(entity == null) return;

	if(!entity.isControlCar()){
		var formation = entity.getFormation();
		if(formation == null) return;
		var ctrlCar = NGTUtil.getMethod(formation.getClass(), formation, "getControlCar", null, []);
		if(ctrlCar == null) return;
		var ctrlCarState = ctrlCar.getResourceState().getDataMap().getInt(key);
		return ctrlCarState;
	}else{
		var keyState = entity.getResourceState().getDataMap().getInt(key);
		return keyState;
	}
}

function render(entity, pass, par3)
{
	var doorMove = 0.64,
		pantaDistance = 7.0;
		
	GL11.glPushMatrix();
	
	//Default
	if(pass==0){
		body.render(renderer);
		render_door(entity, doorMove);
		render_light(entity);
		render_panta(entity, pantaDistance);
		render_Monitor_1(entity);
		render_through_door(entity);
	}
	
	//Alpha
	if(pass==1){
		alpha.render(renderer);
		render_door_a(entity, doorMove);
		render_Monitor_1(entity);
		render_through_door_a(entity);
	}
	
	if(pass>=2){
		body.render(renderer);
		render_light(entity);
		render_door(entity, doorMove);
		render_Monitor_1(entity);
	}

	GL11.glPopMatrix();
}

//render_Light
function render_light(entity){

	if(entity != null){
		var exl = entity.getTrainStateData(8);
	}

	var lightMove = 0;

	try{
		lightMove = (entity.seatRotation)/ 45;
	}catch(e){}

	 if(lightMove < 0){
	  GL11.glPushMatrix();
	  lightF.render(renderer);
	  GL11.glPopMatrix();
	 }else{
	  GL11.glPushMatrix();
	  lightB.render(renderer);
	  GL11.glPopMatrix();
	 }

	if(3 <= exl && exl <= 4){
		ExLFon.render(renderer);
	}else{
		ExLFoff.render(renderer);
	}
}

//render_Door
function render_door(entity,doorMove){
	
	var doorMoveL = 0.0,
		doorMoveR = 0.0;
	
	try{
		doorMoveL = renderer.sigmoid(entity.doorMoveL / 60) * doorMove;
		doorMoveR = renderer.sigmoid(entity.doorMoveR / 60) * doorMove;
	}catch(e){}
	
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, doorMoveL);
	door_LF.render(renderer);
	GL11.glPopMatrix();
	
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, -doorMoveL);
	door_LB.render(renderer);
	GL11.glPopMatrix();
	
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, doorMoveR);
	door_RF.render(renderer);
	GL11.glPopMatrix();
	
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, -doorMoveR);
	door_RB.render(renderer);
	GL11.glPopMatrix();
}

//render_AlphaDoor
function render_door_a(entity,doorMove){
	
	var doorMoveL = 0.0,
		doorMoveR = 0.0;
	
	try{
		doorMoveL = renderer.sigmoid(entity.doorMoveL / 60) * doorMove;
		doorMoveR = renderer.sigmoid(entity.doorMoveR / 60) * doorMove;
	}catch(e){}
	
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, doorMoveL);
	door_LFa.render(renderer);
	GL11.glPopMatrix();
	
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, -doorMoveL);
	door_LBa.render(renderer);
	GL11.glPopMatrix();
	
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, doorMoveR);
	door_RFa.render(renderer);
	GL11.glPopMatrix();
	
	GL11.glPushMatrix();
	GL11.glTranslatef(0.0, 0.0, -doorMoveR);
	door_RBa.render(renderer);
	GL11.glPopMatrix();
}

//render_Panta
function render_panta(entity,pantaDistance){

	if(entity==null) return;
	var keyState1 = getKeyState(entity, "Button0");

	var pantaState = 0.0,
		pDis = pantaDistance;

	try{
		pantaState = renderer.sigmoid(entity.pantograph_F / 40);
	}catch(e){}

	if(keyState1 == 0){
		var pCro1 = pantaState * 15 + 14,
			pCro2 = pantaState * 35 + 24,
			pCro4 = pantaState * 36 + 24,
			pCro5 = pantaState * 38 + 28;
	}else{
		var pCro1 = pantaState * 29,
			pCro2 = pantaState * 59,
			pCro4 = pantaState * 60,
			pCro5 = pantaState * 66;
	}

	//panta_C1
	GL11.glPushMatrix();
	renderer.rotate(pCro1, 'X', 0.0, 3.0118, pDis-0.314);
	pantaC11.render(renderer);
			GL11.glPushMatrix();
			renderer.rotate(-pCro4, 'X', 0.0, 3.6084, pDis+0.7523);
			pantaC14.render(renderer);
			GL11.glPopMatrix();
		renderer.rotate(-pCro2, 'X', 0.0, 3.7151, pDis+0.8641);
		pantaC12.render(renderer);
			GL11.glPushMatrix();
			renderer.rotate(pCro2-pCro1, 'X', 0.0, 4.5998, pDis-0.6186);
			pantaC13.render(renderer);
			GL11.glPopMatrix();
			renderer.rotate(pCro5, 'X', 0.0, 3.5258, pDis+0.9758);
			pantaC15.render(renderer);
	GL11.glPopMatrix();

	//panta_D2
	GL11.glPushMatrix();
	renderer.rotate(-pCro1, 'X', 0.0, 3.0118, -pDis+0.314);
	pantaD21.render(renderer);
			GL11.glPushMatrix();
			renderer.rotate(pCro4, 'X', 0.0, 3.6084, -pDis-0.7523);
			pantaD24.render(renderer);
			GL11.glPopMatrix();
		renderer.rotate(pCro2, 'X', 0.0, 3.7151, -pDis-0.8641);
		pantaD22.render(renderer);
			GL11.glPushMatrix();
			renderer.rotate(-pCro2+pCro1, 'X', 0.0, 4.5998, -pDis+0.6186);
			pantaD23.render(renderer);
			GL11.glPopMatrix();
			renderer.rotate(-pCro5, 'X', 0.0, 3.5258, -pDis-0.9758);
			pantaD25.render(renderer);
	GL11.glPopMatrix();
}

//ATS https://twitter.com/0NKAWA_S0UR1/status/1234863479192014858
function render_Monitor_1(entity){
	if(entity == null){
		return
	}

	var signal = entity.getSignal();
	var speed = Math.ceil(entity.getSpeed() * 72);

//1段目
if (1 <= signal && signal <= 17){
	K_ATS.render(renderer);
} 
else {
	NO_ATS.render(renderer);
}

//2段目
switch (signal) {
	case 1 : L0.render(renderer); break;
	case 2 : L15.render(renderer); break;
	case 3 : L25.render(renderer); break;
	case 4 : L35.render(renderer); break;
	case 5 : L45.render(renderer); break;
	case 6 : L55.render(renderer); break;
	case 7 : L65.render(renderer); break;
	case 8 : L75.render(renderer); break;
	case 9 : L85.render(renderer); break;
	case 10 : L95.render(renderer); break;
	case 11 : L100.render(renderer); break;
	case 12 : L110.render(renderer); break;
	case 13 : L120.render(renderer); break;
	case 14 : L130.render(renderer); break;
	case 15 : L140.render(renderer); break;
	case 16 : L150.render(renderer); break;
	case 17 : L160.render(renderer); break;
	default : L25.render(renderer); break;
}

//3段目
if ((signal == 1 && speed > 0) ||
	(signal == 2 && speed > 15) || 
	(signal == 3 && speed > 25) || 
	(signal == 4 && speed > 35) || 
	(signal == 5 && speed > 45) || 
	(signal == 6 && speed > 55) || 
	(signal == 7 && speed > 65) || 
	(signal == 8 && speed > 75) || 
	(signal == 9 && speed > 85) || 
	(signal == 10 && speed > 95) || 
	(signal == 11 && speed > 100) || 
	(signal == 12 && speed > 110) || 
	(signal == 13 && speed > 120) ||
	(signal == 14 && speed > 130) ||
	(signal == 15 && speed > 140) ||
	(signal == 16 && speed > 150) ||
	(signal == 17 && speed > 160))
	{
		ATS_B.render(renderer);
	}
if (signal == 18) {
	ATS_PA.render(renderer);
    }
}

//貫通幌
function render_through_door(entity){

	if(entity != null){
		var form = isMiddleCar(entity);
		var Fnext= isFrontNextCar(entity);
	}

	if(form == false){
		if(Fnext == false){
			GL11.glPushMatrix();
			doorFoff.render(renderer);
			GL11.glPopMatrix();
		}else{
			GL11.glPushMatrix();
			doorFon.render(renderer);
			GL11.glPopMatrix();
		}
	}else{
		GL11.glPushMatrix();
		doorFon.render(renderer);
		GL11.glPopMatrix();
	}
}

//貫通扉透明
function render_through_door_a(entity){

	if(entity != null){
		var form = isMiddleCar(entity);
		var Fnext= isFrontNextCar(entity);
	}

	if(form == false){
		if(Fnext == false){
			GL11.glPushMatrix();
			doorFoffa.render(renderer);
			GL11.glPopMatrix();
		}else{
			GL11.glPushMatrix();
			doorFona.render(renderer);
			GL11.glPopMatrix();
		}
	}else{
		GL11.glPushMatrix();
		doorFona.render(renderer);
		GL11.glPopMatrix();
	}
}
