var renderClass = "jp.ngt.rtm.render.VehiclePartsRenderer";
importPackage(Packages.org.lwjgl.opengl);
importPackage(Packages.jp.ngt.rtm.render);

function init (par1, par2)
{
	frame = renderer.registerParts(new Parts("obj1"));   
	wheel1 = renderer.registerParts(new Parts("obj2")); 
	wheel2 = renderer.registerParts(new Parts("obj3")); 
}

function render(entity, pass, par3)
{
	GL11.glPushMatrix();
	
	var f0 = renderer.getWheelRotationR(entity);
    var y0 = -0.5427
    var z1 = 1.05
    var z2 = -1.05

	frame.render(renderer);

	GL11.glPushMatrix();
	renderer.rotate(f0, 'X', 0, y0, z1);
	wheel1.render(renderer);
	GL11.glPopMatrix();

	GL11.glPushMatrix();
	renderer.rotate(f0, 'X', 0, y0, z2);
	wheel2.render(renderer);
	GL11.glPopMatrix();

    GL11.glPopMatrix();
}